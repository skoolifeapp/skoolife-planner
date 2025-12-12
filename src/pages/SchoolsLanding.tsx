import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle, GraduationCap, Users, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

const SchoolsLanding = () => {
  const [formData, setFormData] = useState({
    school_name: '',
    contact_email: '',
    contact_phone: '',
    school_type: '',
    student_count: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('school_leads')
        .insert([formData]);

      if (error) throw error;
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Skoolife" className="w-10 h-10 rounded-xl shadow-glow" />
            <span className="text-xl font-bold text-foreground">Skoolife</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </nav>
      </header>

      <main className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Offre établissements
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6">
              Skoolife pour les{' '}
              <span className="gradient-text-animated">établissements</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Offrez à vos étudiants un outil de planification intelligent pour maximiser leur réussite académique.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold mb-6">Pourquoi choisir Skoolife ?</h2>
              
              <div className="space-y-6">
                <BenefitCard
                  icon={<Users className="w-6 h-6" />}
                  title="Accompagnement personnalisé"
                  description="Chaque étudiant bénéficie d'un planning adapté à son rythme et ses objectifs."
                />
                <BenefitCard
                  icon={<Calendar className="w-6 h-6" />}
                  title="Intégration emploi du temps"
                  description="Import automatique des calendriers de votre ENT pour une synchronisation parfaite."
                />
                <BenefitCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  title="Suivi de progression"
                  description="Tableaux de bord et statistiques pour mesurer l'engagement des étudiants."
                />
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border">
                <p className="text-lg font-medium text-foreground mb-2">
                  "Skoolife nous permet d'accompagner nos étudiants de manière plus efficace dans leur organisation."
                </p>
                <p className="text-sm text-muted-foreground">
                  — Responsable pédagogique, École de Commerce
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Demande envoyée !</h3>
                  <p className="text-muted-foreground mb-6">
                    Merci pour votre intérêt. Notre équipe vous contactera dans les plus brefs délais.
                  </p>
                  <Link to="/">
                    <Button variant="outline">Retour à l'accueil</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">Demander une présentation</h3>
                  <p className="text-muted-foreground mb-6">
                    Remplissez ce formulaire et notre équipe vous recontactera.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="school_name">Nom de l'établissement *</Label>
                      <Input
                        id="school_name"
                        required
                        value={formData.school_name}
                        onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                        placeholder="Ex: Université Paris-Saclay"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email de contact *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        required
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        placeholder="contact@etablissement.fr"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Téléphone</Label>
                      <Input
                        id="contact_phone"
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        placeholder="01 23 45 67 89"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="school_type">Type d'établissement</Label>
                      <Select
                        value={formData.school_type}
                        onValueChange={(value) => setFormData({ ...formData, school_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lycee">Lycée</SelectItem>
                          <SelectItem value="universite">Université</SelectItem>
                          <SelectItem value="ecole_commerce">École de commerce</SelectItem>
                          <SelectItem value="ecole_ingenieur">École d'ingénieurs</SelectItem>
                          <SelectItem value="bts_iut">BTS / IUT</SelectItem>
                          <SelectItem value="prepa">Classe préparatoire</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="student_count">Nombre d'étudiants</Label>
                      <Select
                        value={formData.student_count}
                        onValueChange={(value) => setFormData({ ...formData, student_count: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moins_100">Moins de 100</SelectItem>
                          <SelectItem value="100_500">100 - 500</SelectItem>
                          <SelectItem value="500_1000">500 - 1 000</SelectItem>
                          <SelectItem value="1000_5000">1 000 - 5 000</SelectItem>
                          <SelectItem value="plus_5000">Plus de 5 000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (optionnel)</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Décrivez vos besoins ou posez vos questions..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Skoolife" className="w-8 h-8 rounded-lg" />
            <span className="font-bold">Skoolife</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © 2025 Skoolife. Fait avec ❤️ pour les étudiants.
          </p>
        </div>
      </footer>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex gap-4">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

export default SchoolsLanding;