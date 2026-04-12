import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ClipboardPlus, Search } from 'lucide-react';

interface ConsultationRecord {
  id: number;
  patientId: number;
  patientName: string;
  consultationDate: string;
  diagnosis: string;
  disease: string;
  bodyTemp: string;
  bloodPressure: string;
  weight: string;
}

const initialConsultations: ConsultationRecord[] = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Juan D. Dela Cruz',
    consultationDate: '2024-10-15',
    diagnosis: 'Patient presents with high fever and body aches',
    disease: 'Dengue',
    bodyTemp: '38.5°C',
    bloodPressure: '120/80',
    weight: '70 kg'
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Maria C. Santos',
    consultationDate: '2024-10-20',
    diagnosis: 'Patient tested positive for COVID-19 with mild symptoms',
    disease: 'COVID-19',
    bodyTemp: '37.8°C',
    bloodPressure: '110/75',
    weight: '55 kg'
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'Pedro M. Rodriguez',
    consultationDate: '2024-10-22',
    diagnosis: 'Patient has difficulty breathing and chest pain',
    disease: 'Pneumonia',
    bodyTemp: '39.2°C',
    bloodPressure: '130/85',
    weight: '68 kg'
  },
];

// List of diseases for dropdown
const diseases = [
  'Tuberculosis',
  'Dengue',
  'COVID-19',
  'Pneumonia',
  'Influenza',
  'Typhoid Fever',
  'Malaria',
  'Diarrhea',
  'Hypertension',
  'Diabetes',
  'Other'
];

export function Consultation() {
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(initialConsultations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    consultationDate: '',
    diagnosis: '',
    disease: '',
    bodyTemp: '',
    bloodPressure: '',
    weight: '',
  });

  const handleAddConsultation = () => {
    if (formData.patientName && formData.consultationDate && formData.diagnosis && formData.disease && formData.bodyTemp && formData.bloodPressure && formData.weight) {
      const newConsultation: ConsultationRecord = {
        id: consultations.length + 1,
        patientId: consultations.length + 1,
        patientName: formData.patientName,
        consultationDate: formData.consultationDate,
        diagnosis: formData.diagnosis,
        disease: formData.disease,
        bodyTemp: formData.bodyTemp,
        bloodPressure: formData.bloodPressure,
        weight: formData.weight,
      };
      
      setConsultations([...consultations, newConsultation]);
      setFormData({
        patientName: '',
        consultationDate: '',
        diagnosis: '',
        disease: '',
        bodyTemp: '',
        bloodPressure: '',
        weight: '',
      });
      setIsDialogOpen(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation =>
    consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-gray-900 mb-2">Patient Consultation Records</h1>
          <p className="text-gray-600">Manage patient consultation history and medical records</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <ClipboardPlus className="w-4 h-4 mr-2" />
              Add New Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Consultation</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <Label htmlFor="consultation-date">Consultation Date</Label>
                <Input
                  id="consultation-date"
                  type="date"
                  value={formData.consultationDate}
                  onChange={(e) => setFormData({ ...formData, consultationDate: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis"
                />
              </div>
              <div>
                <Label htmlFor="disease">Disease</Label>
                <Select value={formData.disease} onValueChange={(value) => setFormData({ ...formData, disease: value })}>
                  <SelectTrigger id="disease">
                    <SelectValue placeholder="Select disease" />
                  </SelectTrigger>
                  <SelectContent>
                    {diseases.map((disease) => (
                      <SelectItem key={disease} value={disease}>
                        {disease}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="body-temp">Body Temperature</Label>
                <Input
                  id="body-temp"
                  value={formData.bodyTemp}
                  onChange={(e) => setFormData({ ...formData, bodyTemp: e.target.value })}
                  placeholder="e.g., 37.5°C"
                />
              </div>
              <div>
                <Label htmlFor="blood-pressure">Blood Pressure</Label>
                <Input
                  id="blood-pressure"
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  placeholder="e.g., 120/80"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 70 kg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddConsultation}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search consultations by patient name, disease, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="mb-2">All Consultations</h2>
          <p className="text-sm text-gray-600">{filteredConsultations.length} consultation(s) found</p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Consultation Date</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Body Temp</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Diagnosis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell>{consultation.id}</TableCell>
                  <TableCell>{consultation.patientName}</TableCell>
                  <TableCell>{consultation.consultationDate}</TableCell>
                  <TableCell>{consultation.disease}</TableCell>
                  <TableCell>{consultation.bodyTemp}</TableCell>
                  <TableCell>{consultation.bloodPressure}</TableCell>
                  <TableCell>{consultation.weight}</TableCell>
                  <TableCell className="max-w-xs truncate">{consultation.diagnosis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
