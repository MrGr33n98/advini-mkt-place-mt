"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Phone, 
  Mail, 
  MessageCircle,
  Calendar,
  Download,
  Eye,
  Trash2,
  Filter,
  Search
} from "lucide-react";
import { useLeadTracking, Lead } from "@/hooks/useLeadTracking";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LeadsDashboard() {
  const {
    leads,
    getLeadStats,
    getTopLawyers,
    getLeadSources,
    getRecentLeads,
    updateLeadStatus,
    deleteLead,
    exportLeads,
  } = useLeadTracking();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const stats = getLeadStats();
  const topLawyers = getTopLawyers();
  const leadSources = getLeadSources();
  const recentLeads = getRecentLeads();

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.lawyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "contacted": return "bg-blue-100 text-blue-700";
      case "responded": return "bg-yellow-100 text-yellow-700";
      case "converted": return "bg-green-100 text-green-700";
      case "lost": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "whatsapp_click": return <MessageCircle className="w-4 h-4" />;
      case "phone_call": return <Phone className="w-4 h-4" />;
      case "email_click": return <Mail className="w-4 h-4" />;
      case "contact_form": return <Mail className="w-4 h-4" />;
      case "quote_request": return <Calendar className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Leads</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie todos os leads gerados
          </p>
        </div>
        <Button onClick={exportLeads} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Dados
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.contacted} novos contatos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.converted} convertidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.responded} responderam
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Perdidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lost}</div>
            <p className="text-xs text-muted-foreground">
              Oportunidades perdidas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leads">Todos os Leads</TabsTrigger>
          <TabsTrigger value="lawyers">Top Advogados</TabsTrigger>
          <TabsTrigger value="sources">Fontes de Lead</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por advogado ou ação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="responded">Respondeu</SelectItem>
                <SelectItem value="converted">Convertido</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Fontes</SelectItem>
                <SelectItem value="direct_contact">Contato Direto</SelectItem>
                <SelectItem value="contact_form">Formulário</SelectItem>
                <SelectItem value="quote_request">Orçamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Leads Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeads.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum lead encontrado
                  </p>
                ) : (
                  filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          {getActionIcon(lead.action)}
                        </div>
                        <div>
                          <p className="font-medium">{lead.lawyerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {lead.action.replace("_", " ")} • {formatDate(lead.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                        <Select
                          value={lead.status}
                          onValueChange={(value) => updateLeadStatus(lead.id, value as Lead["status"])}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contacted">Contatado</SelectItem>
                            <SelectItem value="responded">Respondeu</SelectItem>
                            <SelectItem value="converted">Convertido</SelectItem>
                            <SelectItem value="lost">Perdido</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteLead(lead.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lawyers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advogados com Mais Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLawyers.map((lawyer, index) => (
                  <div
                    key={lawyer.lawyerId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{lawyer.lawyerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {lawyer.totalLeads} leads • {lawyer.convertedLeads} convertidos
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {lawyer.conversionRate}% conversão
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fontes de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSources.map((source) => (
                  <div
                    key={source.source}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getActionIcon(source.source)}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {source.source.replace("_", " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Fonte de leads
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {source.count} leads
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}