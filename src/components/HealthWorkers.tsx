import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { UserPlus, Search, Mail, Phone } from 'lucide-react';
import { Badge } from './ui/badge';

interface HealthWorker {
  id: number;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Barangay Health Worker';
  specialization?: string;
  barangay: string;
  email: string;
  phone: string;
  yearsOfService: number;
  status: string;
}

const initialWorkers: HealthWorker[] = [
  { id: 1, name: 'Dr. Ana Reyes', role: 'Doctor', specialization: 'Internal Medicine', barangay: 'Barangay 1', email: 'ana.reyes@cdohealth.gov', phone: '0912-345-6789', yearsOfService: 10, status: 'Active' },
  { id: 2, name: 'Nurse Carlo Mendoza', role: 'Nurse', barangay: 'Carmen', email: 'carlo.mendoza@cdohealth.gov', phone: '0923-456-7890', yearsOfService: 5, status: 'Active' },
  { id: 3, name: 'BHW Rosa Garcia', role: 'Barangay Health Worker', barangay: 'Balulang', email: 'rosa.garcia@cdohealth.gov', phone: '0934-567-8901', yearsOfService: 8, status: 'Active' },
  { id: 4, name: 'Dr. Miguel Santos', role: 'Doctor', specialization: 'Pediatrics', barangay: 'Gusa', email: 'miguel.santos@cdohealth.gov', phone: '0945-678-9012', yearsOfService: 15, status: 'Active' },
];

export function HealthWorkers() {
  const [workers, setWorkers] = useState<HealthWorker[]>(initialWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<HealthWorker | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '' as 'Doctor' | 'Nurse' | 'Barangay Health Worker' | '',
    specialization: '',
    barangay: '',
    email: '',
    phone: '',
    yearsOfService: '',
    status: 'Active'
  });

  const handleAddWorker = () => {
    if (formData.name && formData.role && formData.barangay && formData.email && formData.phone) {
      const newWorker: HealthWorker = {
        id: workers.length + 1,
        name: formData.name,
        role: formData.role as 'Doctor' | 'Nurse' | 'Barangay Health Worker',
        specialization: formData.specialization || undefined,
        barangay: formData.barangay,
        email: formData.email,
        phone: formData.phone,
        yearsOfService: parseInt(formData.yearsOfService) || 0,
        status: formData.status
      };
      
      setWorkers([...workers, newWorker]);
      setFormData({
        name: '',
        role: '',
        specialization: '',
        barangay: '',
        email: '',
        phone: '',
        yearsOfService: '',
        status: 'Active'
      });
      setIsDialogOpen(false);
    }
  };

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.barangay.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterByRole = (role: string) => {
    if (role === 'all') return filteredWorkers;
    return filteredWorkers.filter(worker => worker.role === role);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-gray-900 mb-2">Health Workers</h1>
          <p className="text-gray-600">Manage health worker profiles and assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Health Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Health Worker</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="worker-name">Full Name</Label>
                <Input
                  id="worker-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="worker-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="worker-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Barangay Health Worker">Barangay Health Worker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'Doctor' && (
                <div>
                  <Label htmlFor="worker-specialization">Specialization</Label>
                  <Input
                    id="worker-specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g., Internal Medicine"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="worker-barangay">Assigned Barangay</Label>
                <Input
                  id="worker-barangay"
                  value={formData.barangay}
                  onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                  placeholder="Enter barangay"
                />
              </div>
              <div>
                <Label htmlFor="worker-email">Email</Label>
                <Input
                  id="worker-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@cdohealth.gov"
                />
              </div>
              <div>
                <Label htmlFor="worker-phone">Phone</Label>
                <Input
                  id="worker-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912-345-6789"
                />
              </div>
              <div>
                <Label htmlFor="worker-years">Years of Service</Label>
                <Input
                  id="worker-years"
                  type="number"
                  value={formData.yearsOfService}
                  onChange={(e) => setFormData({ ...formData, yearsOfService: e.target.value })}
                  placeholder="Enter years"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWorker}>Add Health Worker</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search health workers by name, role, or barangay..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      </Card>

      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Workers</TabsTrigger>
            <TabsTrigger value="Doctor">Doctors</TabsTrigger>
            <TabsTrigger value="Nurse">Nurses</TabsTrigger>
            <TabsTrigger value="Barangay Health Worker">BHWs</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <WorkerTable workers={filteredWorkers} onViewProfile={(worker) => {
              setSelectedWorker(worker);
              setIsProfileOpen(true);
            }} />
          </TabsContent>
          <TabsContent value="Doctor">
            <WorkerTable workers={filterByRole('Doctor')} onViewProfile={(worker) => {
              setSelectedWorker(worker);
              setIsProfileOpen(true);
            }} />
          </TabsContent>
          <TabsContent value="Nurse">
            <WorkerTable workers={filterByRole('Nurse')} onViewProfile={(worker) => {
              setSelectedWorker(worker);
              setIsProfileOpen(true);
            }} />
          </TabsContent>
          <TabsContent value="Barangay Health Worker">
            <WorkerTable workers={filterByRole('Barangay Health Worker')} onViewProfile={(worker) => {
              setSelectedWorker(worker);
              setIsProfileOpen(true);
            }} />
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Health Worker Profile</DialogTitle>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-6 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="mb-1">{selectedWorker.name}</h2>
                  <Badge>{selectedWorker.role}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {selectedWorker.specialization && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Specialization</p>
                    <p>{selectedWorker.specialization}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned Barangay</p>
                  <p>{selectedWorker.barangay}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Years of Service</p>
                  <p>{selectedWorker.yearsOfService} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge variant={selectedWorker.status === 'Active' ? 'default' : 'secondary'}>
                    {selectedWorker.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedWorker.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedWorker.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkerTable({ workers, onViewProfile }: { workers: HealthWorker[], onViewProfile: (worker: HealthWorker) => void }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>Years of Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <TableRow key={worker.id}>
              <TableCell>{worker.id}</TableCell>
              <TableCell>{worker.name}</TableCell>
              <TableCell>{worker.role}</TableCell>
              <TableCell>{worker.specialization || '-'}</TableCell>
              <TableCell>{worker.barangay}</TableCell>
              <TableCell>{worker.yearsOfService}</TableCell>
              <TableCell>
                <Badge variant={worker.status === 'Active' ? 'default' : 'secondary'}>
                  {worker.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProfile(worker)}
                >
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
