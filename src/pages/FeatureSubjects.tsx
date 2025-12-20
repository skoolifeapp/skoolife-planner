import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, Plus, Calendar, Clock, Target, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Static Subjects Card Component
const StaticSubjectsCard = () => (
  <div className="h-[500px] md:h-[600px] flex flex-col bg-[#FFFDF8] dark:bg-card rounded-xl md:rounded-2xl border border-border/20 overflow-hidden shadow-xl">
    {/* App Header Bar */}
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20 bg-[#FFFDF8] dark:bg-card">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">S</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <GraduationCap className="w-4 h-4" />
          <ChevronRight className="w-3 h-3" />
          <span className="text-sm font-medium text-foreground">Matières</span>
        </div>
      </div>
    </div>

    {/* Page Header */}
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Mes matières & examens</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Ajoute tes matières et leurs dates d'examen</p>
      </div>
      <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
        <Plus className="w-3.5 h-3.5" />
        Ajouter une matière
      </button>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col px-6 pb-4 gap-4 overflow-hidden">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Matières actives</p>
            <p className="text-xl font-bold text-foreground">6</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prochain examen</p>
            <p className="text-base font-semibold text-foreground">Finance <span className="text-primary">J-25</span></p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Heures visées</p>
            <p className="text-xl font-bold text-foreground">120h</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Toutes (6)</span>
        <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Partiel (4)</span>
        <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Oral (1)</span>
        <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">Projet (1)</span>
      </div>

      {/* Subjects Table */}
      <div className="flex-1 rounded-xl border border-border/30 bg-white dark:bg-card overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 bg-muted/30">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Matière</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Date d'examen</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Objectif</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Priorité</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Statut</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 - Finance */}
            <tr className="border-b border-border/10 hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                  <span className="text-sm font-medium text-foreground">Finance</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">14/01/2025</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">25h</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-destructive/20 text-destructive">Haute</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">Active</span>
              </td>
              <td className="px-4 py-3 text-right">
                <ChevronRight className="w-4 h-4 text-muted-foreground inline-block" />
              </td>
            </tr>
            {/* Row 2 - MCG */}
            <tr className="border-b border-border/10 hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  <span className="text-sm font-medium text-foreground">MCG</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">14/01/2025</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">30h</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-destructive/20 text-destructive">Haute</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">Active</span>
              </td>
              <td className="px-4 py-3 text-right">
                <ChevronRight className="w-4 h-4 text-muted-foreground inline-block" />
              </td>
            </tr>
            {/* Row 3 - MSI */}
            <tr className="border-b border-border/10 hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                  <span className="text-sm font-medium text-foreground">MSI</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">16/01/2025</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">20h</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">Moyenne</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">Active</span>
              </td>
              <td className="px-4 py-3 text-right">
                <ChevronRight className="w-4 h-4 text-muted-foreground inline-block" />
              </td>
            </tr>
            {/* Row 4 - Droit */}
            <tr className="border-b border-border/10 hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                  <span className="text-sm font-medium text-foreground">Droit</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">18/01/2025</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">15h</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Basse</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">Active</span>
              </td>
              <td className="px-4 py-3 text-right">
                <ChevronRight className="w-4 h-4 text-muted-foreground inline-block" />
              </td>
            </tr>
            {/* Row 5 - Marketing */}
            <tr className="border-b border-border/10 hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                  <span className="text-sm font-medium text-foreground">Marketing</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">20/01/2025</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">15h</td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">Moyenne</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">Active</span>
              </td>
              <td className="px-4 py-3 text-right">
                <ChevronRight className="w-4 h-4 text-muted-foreground inline-block" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const FeatureSubjects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-5 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-40 right-5 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      </div>

      {/* Hero Section */}
      <main className="relative pt-24 md:pt-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Main heading */}
          <div className="space-y-4 md:space-y-6 animate-slide-up mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight font-heading">
              Gestion des
              <br />
              <span className="gradient-text-animated font-heading">
                Matières
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Organise toutes tes matières et examens en un seul endroit. Définis tes objectifs 
            de révision, suis les dates importantes et priorise efficacement ton travail.
          </p>

          {/* CTA Button */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/auth?mode=signup">
              <Button variant="outline" size="lg" className="rounded-full px-6">
                Organiser mes matières
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Static Subjects Preview */}
        <div className="relative max-w-6xl mx-auto px-4 mt-16 pb-16">
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <StaticSubjectsCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeatureSubjects;