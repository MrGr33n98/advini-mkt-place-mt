"use client";

import { useState, useEffect } from "react";

export interface Lead {
  id: number;
  lawyerId: string;
  lawyerName: string;
  action: string;
  timestamp: string;
  source: string;
  status: "contacted" | "responded" | "converted" | "lost";
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    subject?: string;
    urgency?: string;
    preferredContact?: string;
  };
  quoteInfo?: {
    legalArea?: string;
    caseType?: string;
    serviceType?: string;
    description?: string;
    budget?: string;
    urgency?: string;
    documents?: string[];
  };
}

export function useLeadTracking() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const storedLeads = localStorage.getItem("leads");
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    }
  }, []);

  const trackLead = (leadData: Omit<Lead, "id" | "timestamp">) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };

    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    localStorage.setItem("leads", JSON.stringify(updatedLeads));

    return newLead;
  };

  const updateLeadStatus = (leadId: number, status: Lead["status"]) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, status } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
  };

  const getLeadsByLawyer = (lawyerId: string) => {
    return leads.filter(lead => lead.lawyerId === lawyerId);
  };

  const getLeadsByStatus = (status: Lead["status"]) => {
    return leads.filter(lead => lead.status === status);
  };

  const getLeadsByDateRange = (startDate: Date, endDate: Date) => {
    return leads.filter(lead => {
      const leadDate = new Date(lead.timestamp);
      return leadDate >= startDate && leadDate <= endDate;
    });
  };

  const getLeadStats = () => {
    const total = leads.length;
    const contacted = leads.filter(lead => lead.status === "contacted").length;
    const responded = leads.filter(lead => lead.status === "responded").length;
    const converted = leads.filter(lead => lead.status === "converted").length;
    const lost = leads.filter(lead => lead.status === "lost").length;

    const conversionRate = total > 0 ? (converted / total) * 100 : 0;
    const responseRate = total > 0 ? (responded / total) * 100 : 0;

    return {
      total,
      contacted,
      responded,
      converted,
      lost,
      conversionRate: Math.round(conversionRate * 100) / 100,
      responseRate: Math.round(responseRate * 100) / 100,
    };
  };

  const getTopLawyers = () => {
    const lawyerLeads = leads.reduce((acc, lead) => {
      if (!acc[lead.lawyerId]) {
        acc[lead.lawyerId] = {
          lawyerId: lead.lawyerId,
          lawyerName: lead.lawyerName,
          totalLeads: 0,
          convertedLeads: 0,
        };
      }
      acc[lead.lawyerId].totalLeads++;
      if (lead.status === "converted") {
        acc[lead.lawyerId].convertedLeads++;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(lawyerLeads)
      .map((lawyer: any) => ({
        ...lawyer,
        conversionRate: lawyer.totalLeads > 0 
          ? Math.round((lawyer.convertedLeads / lawyer.totalLeads) * 100 * 100) / 100
          : 0,
      }))
      .sort((a, b) => b.totalLeads - a.totalLeads);
  };

  const getLeadSources = () => {
    const sources = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getRecentLeads = (limit: number = 10) => {
    return leads
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  };

  const deleteLead = (leadId: number) => {
    const updatedLeads = leads.filter(lead => lead.id !== leadId);
    setLeads(updatedLeads);
    localStorage.setItem("leads", JSON.stringify(updatedLeads));
  };

  const exportLeads = () => {
    const dataStr = JSON.stringify(leads, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `leads_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    leads,
    trackLead,
    updateLeadStatus,
    getLeadsByLawyer,
    getLeadsByStatus,
    getLeadsByDateRange,
    getLeadStats,
    getTopLawyers,
    getLeadSources,
    getRecentLeads,
    deleteLead,
    exportLeads,
  };
}