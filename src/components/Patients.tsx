import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPlus, Search } from 'lucide-react';

interface Patient {
  id: number;
  firstName: string;
  middleInitial: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  civilStatus: string;
  occupation: string;
  barangay: string;
  patientSource: string;
  bhw: string;
  dateOfRegistration: string;
  disease: string;
  status: string;
}

const initialPatients: Patient[] = [
  { 
    id: 1, 
    firstName: 'Juan',
    middleInitial: 'D',
    lastName: 'Dela Cruz',
    dateOfBirth: '1979-05-15',
    age: 45, 
    gender: 'Male',
    civilStatus: 'Married',
    occupation: 'Teacher',
    barangay: 'Barangay 1',
    patientSource: 'Walk-in',
    bhw: 'BHW Santos',
    dateOfRegistration: '2024-10-01',
    disease: 'Dengue', 
    status: 'Active' 
  },
  { 
    id: 2, 
    firstName: 'Maria',
    middleInitial: 'C',
    lastName: 'Santos',
    dateOfBirth: '1992-08-20',
    age: 32, 
    gender: 'Female',
    civilStatus: 'Single',
    occupation: 'Nurse',
    barangay: 'Carmen',
    patientSource: 'Referral',
    bhw: 'BHW Rodriguez',
    dateOfRegistration: '2024-10-05',
    disease: 'COVID-19', 
    status: 'Recovered' 
  },
  { 
    id: 3, 
    firstName: 'Pedro',
    middleInitial: 'M',
    lastName: 'Rodriguez',
    dateOfBirth: '1966-03-10',
    age: 58, 
    gender: 'Male',
    civilStatus: 'Widowed',
    occupation: 'Driver',
    barangay: 'Balulang',
    patientSource: 'Walk-in',
    bhw: 'BHW Cruz',
    dateOfRegistration: '2024-10-08',
    disease: 'Pneumonia', 
    status: 'Active' 
  },
];

export function Patients() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    occupation: '',
    barangay: '',
    dateOfRegistration: '',
    dateOfBirth: '',
    civilStatus: '',
    gender: '',
    patientSource: '',
    bhw: '',
  });

  const handleAddPatient = () => {
    if (formData.firstName && formData.lastName && formData.dateOfBirth && formData.dateOfRegistration && formData.gender && formData.civilStatus && formData.occupation && formData.barangay && formData.patientSource && formData.bhw) {
      // Calculate age from date of birth
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      const newPatient: Patient = {
        id: patients.length + 1,
        firstName: formData.firstName,
        middleInitial: formData.middleInitial,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        age: age,
        gender: formData.gender,
        civilStatus: formData.civilStatus,
        occupation: formData.occupation,
        barangay: formData.barangay,
        patientSource: formData.patientSource,
        bhw: formData.bhw,
        dateOfRegistration: formData.dateOfRegistration,
        disease: '',
        status: 'Active'
      };
      
      setPatients([...patients, newPatient]);
      setFormData({
        firstName: '',
        middleInitial: '',
        lastName: '',
        occupation: '',
        barangay: '',
        dateOfRegistration: '',
        dateOfBirth: '',
        civilStatus: '',
        gender: '',
        patientSource: '',
        bhw: '',
      });
      setIsDialogOpen(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.middleInitial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.barangay.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-gray-900 mb-2">Patient Records</h1>
          <p className="text-gray-600">Manage patient information and records</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="patient-first-name">First Name</Label>
                <Input
                  id="patient-first-name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="patient-middle-initial">Middle Initial</Label>
                <Input
                  id="patient-middle-initial"
                  value={formData.middleInitial}
                  onChange={(e) => setFormData({ ...formData, middleInitial: e.target.value })}
                  placeholder="Enter middle initial"
                />
              </div>
              <div>
                <Label htmlFor="patient-last-name">Last Name</Label>
                <Input
                  id="patient-last-name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="patient-date-of-birth">Date of Birth</Label>
                <Input
                  id="patient-date-of-birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="patient-gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger id="patient-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="patient-civil-status">Civil Status</Label>
                <Select value={formData.civilStatus} onValueChange={(value) => setFormData({ ...formData, civilStatus: value })}>
                  <SelectTrigger id="patient-civil-status">
                    <SelectValue placeholder="Select civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="patient-occupation">Occupation</Label>
                <Input
                  id="patient-occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Enter occupation"
                />
              </div>
              <div>
                <Label htmlFor="patient-barangay">Barangay</Label>
                <Input
                  id="patient-barangay"
                  value={formData.barangay}
                  onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                  placeholder="Enter barangay"
                />
              </div>
              <div>
                <Label htmlFor="patient-patient-source">Patient Source</Label>
                <Select value={formData.patientSource} onValueChange={(value) => setFormData({ ...formData, patientSource: value })}>
                  <SelectTrigger id="patient-patient-source">
                    <SelectValue placeholder="Select patient source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="patient-bhw">BHW</Label>
                <Input
                  id="patient-bhw"
                  value={formData.bhw}
                  onChange={(e) => setFormData({ ...formData, bhw: e.target.value })}
                  placeholder="Enter BHW"
                />
              </div>
              <div>
                <Label htmlFor="patient-date-of-registration">Date of Registration</Label>
                <Input
                  id="patient-date-of-registration"
                  type="date"
                  value={formData.dateOfRegistration}
                  onChange={(e) => setFormData({ ...formData, dateOfRegistration: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPatient}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search patients by name, disease, or barangay..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="mb-2">All Patients</h2>
          <p className="text-sm text-gray-600">{filteredPatients.length} patient(s) found</p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Barangay</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Date Admitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.firstName} {patient.middleInitial}. {patient.lastName}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.barangay}</TableCell>
                  <TableCell>{patient.disease}</TableCell>
                  <TableCell>{patient.dateOfRegistration}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        patient.status === 'Active'
                          ? 'bg-blue-100 text-blue-600'
                          : patient.status === 'Recovered'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}