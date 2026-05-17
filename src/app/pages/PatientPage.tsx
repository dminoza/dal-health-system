import { useState, useEffect } from "react";
import { Search, Plus, X, ChevronDown, Loader2 } from "lucide-react";
import { supabase } from "../../utils/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Barangay {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  registration_date: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  birthdate: string;
  gender: string;
  status: string;
  barangay_id: string;
  barangay: Barangay; // joined
}

const GENDERS = ["M", "F"];
const STATUSES = ["Single", "Married", "Widowed", "Separated"];

const emptyForm = {
  registration_date: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  birthdate: "",
  gender: "",
  status: "",
  barangay_id: "",
};

// ---------------------------------------------------------------------------
// Reusable fields
// ---------------------------------------------------------------------------

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function InputField({ label, value, onChange, type = "text", placeholder, required }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

function SelectField({ label, value, onChange, options, placeholder = "Select…", required, disabled }: SelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10 disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function PatientPage() {
  const [patients, setPatients]       = useState<Patient[]>([]);
  const [barangays, setBarangays]     = useState<Barangay[]>([]);
  const [search, setSearch]           = useState("");
  const [filterBarangay, setFilter]   = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState(emptyForm);
  const [formError, setFormError]     = useState("");
  const [saving, setSaving]           = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError]   = useState("");

  // -------------------------------------------------------------------------
  // Fetch barangays + patients on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoadingData(true);
    setFetchError("");

    const [{ data: brgy, error: brgyErr }, { data: pats, error: patsErr }] =
      await Promise.all([
        supabase.from("barangays").select("id, name").order("name"),
        supabase
          .from("patients")
          .select(`
            id,
            registration_date,
            first_name,
            middle_name,
            last_name,
            birthdate,
            gender,
            status,
            barangay_id,
            barangay:barangays ( id, name )
          `)
          .order("registration_date", { ascending: false }),
      ]);

    if (brgyErr || patsErr) {
      setFetchError(brgyErr?.message ?? patsErr?.message ?? "Failed to load data.");
    } else {
      setBarangays(brgy ?? []);
      setPatients((pats as unknown as Patient[]) ?? []);
    }

    setLoadingData(false);
  }

  // -------------------------------------------------------------------------
  // Filtering
  // -------------------------------------------------------------------------
  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.barangay?.name.toLowerCase().includes(q);
    const matchBarangay = !filterBarangay || p.barangay_id === filterBarangay;
    return matchSearch && matchBarangay;
  });

  const setField = (key: keyof typeof emptyForm) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  // -------------------------------------------------------------------------
  // Insert
  // -------------------------------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (
      !form.first_name || !form.last_name ||
      !form.registration_date || !form.birthdate ||
      !form.gender || !form.status || !form.barangay_id
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("patients")
      .insert([{
        registration_date: form.registration_date,
        first_name:        form.first_name,
        middle_name:       form.middle_name || null,
        last_name:         form.last_name,
        birthdate:         form.birthdate,
        gender:            form.gender,
        status:            form.status,
        barangay_id:       form.barangay_id,
      }])
      .select(`
        id,
        registration_date,
        first_name,
        middle_name,
        last_name,
        birthdate,
        gender,
        status,
        barangay_id,
        barangay:barangays ( id, name )
      `)
      .single();

    setSaving(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    setPatients((prev) => [data as unknown as Patient, ...prev]);
    setForm(emptyForm);
    setShowModal(false);
  }

  function handleClose() {
    setShowModal(false);
    setForm(emptyForm);
    setFormError("");
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or barangay…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Barangay filter — from DB */}
        <div className="relative">
          <select
            value={filterBarangay}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Barangays</option>
            {barangays.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Patient
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Middle Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Birthdate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Barangay</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reg. Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingData ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading patients…
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center">
                    <p className="text-red-500 text-sm mb-2">{fetchError}</p>
                    <button onClick={loadAll} className="text-blue-600 text-sm hover:underline">
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">
                      {p.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{p.first_name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.middle_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-900">{p.last_name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.birthdate}</td>
                    <td className="px-4 py-3 text-gray-700">{p.gender}</td>
                    <td className="px-4 py-3 text-gray-700">{p.status}</td>
                    <td className="px-4 py-3 text-gray-700">{p.barangay?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{p.registration_date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loadingData && !fetchError && (
          <p className="text-xs text-gray-400 mt-3">
            Showing {filtered.length} of {patients.length} patients
          </p>
        )}
      </div>

      {/* Add New Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Patient</h2>
              <button onClick={handleClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <form id="patient-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <InputField
                label="Registration Date"
                type="date"
                value={form.registration_date}
                onChange={setField("registration_date")}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="First Name"
                  value={form.first_name}
                  onChange={setField("first_name")}
                  placeholder="Juan"
                  required
                />
                <InputField
                  label="Last Name"
                  value={form.last_name}
                  onChange={setField("last_name")}
                  placeholder="dela Cruz"
                  required
                />
              </div>

              <InputField
                label="Middle Name"
                value={form.middle_name}
                onChange={setField("middle_name")}
                placeholder="(optional)"
              />

              <InputField
                label="Birthdate"
                type="date"
                value={form.birthdate}
                onChange={setField("birthdate")}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Gender"
                  value={form.gender}
                  onChange={setField("gender")}
                  options={GENDERS.map((g) => ({ value: g, label: g === "M" ? "Male" : "Female" }))}
                  placeholder="Select…"
                  required
                />
                <SelectField
                  label="Civil Status"
                  value={form.status}
                  onChange={setField("status")}
                  options={STATUSES.map((s) => ({ value: s, label: s }))}
                  placeholder="Select…"
                  required
                />
              </div>

              {/* Barangay dropdown — loaded from DB */}
              <SelectField
                label="Barangay"
                value={form.barangay_id}
                onChange={setField("barangay_id")}
                options={barangays.map((b) => ({ value: b.id, label: b.name }))}
                placeholder={barangays.length === 0 ? "Loading…" : "Select barangay…"}
                required
                disabled={barangays.length === 0}
              />

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {formError}
                </p>
              )}
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="patient-form"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Saving…" : "Save Patient"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
