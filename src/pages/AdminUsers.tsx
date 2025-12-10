import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Search, GraduationCap, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Profile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  school: string | null;
  level: string | null;
  created_at: string | null;
  is_onboarding_complete: boolean | null;
}

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });

  const filteredProfiles = profiles.filter((profile) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.email?.toLowerCase().includes(searchLower) ||
      profile.first_name?.toLowerCase().includes(searchLower) ||
      profile.last_name?.toLowerCase().includes(searchLower) ||
      profile.school?.toLowerCase().includes(searchLower)
    );
  });

  const completedOnboarding = profiles.filter(p => p.is_onboarding_complete).length;

  return (
    <AdminSidebar>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
          <p className="text-muted-foreground">Liste des étudiants inscrits sur la plateforme</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total utilisateurs</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Onboarding complété</CardTitle>
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOnboarding}</div>
              <p className="text-xs text-muted-foreground">
                {profiles.length > 0 ? Math.round((completedOnboarding / profiles.length) * 100) : 0}% des inscrits
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nouveaux ce mois</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles.filter(p => {
                  if (!p.created_at) return false;
                  const createdDate = new Date(p.created_at);
                  const now = new Date();
                  return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email ou école..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Chargement...</div>
            ) : filteredProfiles.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Aucun utilisateur trouvé</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium text-muted-foreground">Utilisateur</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">École</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Niveau</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Inscrit le</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((profile) => (
                      <tr key={profile.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                        <td className="p-4">
                          <div className="font-medium">
                            {profile.first_name || profile.last_name
                              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                              : '—'}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{profile.email || '—'}</td>
                        <td className="p-4 text-muted-foreground">{profile.school || '—'}</td>
                        <td className="p-4 text-muted-foreground">{profile.level || '—'}</td>
                        <td className="p-4 text-muted-foreground">
                          {profile.created_at
                            ? format(new Date(profile.created_at), 'dd MMM yyyy', { locale: fr })
                            : '—'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              profile.is_onboarding_complete
                                ? 'bg-green-500/10 text-green-600'
                                : 'bg-yellow-500/10 text-yellow-600'
                            }`}
                          >
                            {profile.is_onboarding_complete ? 'Actif' : 'En cours'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminSidebar>
  );
};

export default AdminUsers;
