/**
 * Camada de dados — API na nuvem (Vercel + Supabase) com fallback localStorage
 */
const VisaoDB = {
  async apiFetch(path, options = {}) {
    const res = await fetch(path, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    return { res, data };
  },

  async addInscricao(payload) {
    const { res, data } = await this.apiFetch("/api/inscricoes", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) return data;
    if (res.status === 503 && data?.fallback) return LocalDB.addInscricao(payload);
    throw new Error(data?.error || "Erro ao enviar inscrição.");
  },

  async addMensagemContato(payload) {
    const { res, data } = await this.apiFetch("/api/contato", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) return data;
    if (res.status === 503 && data?.fallback) return LocalDB.addMensagemContato(payload);
    throw new Error(data?.error || "Erro ao enviar mensagem.");
  },

  async loginAdmin(email, password) {
    const { res, data } = await this.apiFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      sessionStorage.setItem("visao_nobre_admin_cloud", "1");
      return data;
    }
    if (res.status === 503 && data?.fallback) {
      await LocalDB.loginAdmin(email, password);
      return LocalDB.getAdminSession?.() || { email };
    }
    throw new Error(data?.error || "Erro ao realizar login.");
  },

  async logoutAdmin() {
    await this.apiFetch("/api/admin/logout", { method: "POST" });
    sessionStorage.removeItem("visao_nobre_admin_cloud");
    LocalDB.logoutAdmin();
  },

  async isAdminLoggedIn() {
    const { res, data } = await this.apiFetch("/api/admin/me");
    if (res.ok) return true;
    if (res.status === 503 && data?.fallback) return LocalDB.isAdminLoggedIn();
    return false;
  },

  async listInscricoes() {
    const { res, data } = await this.apiFetch("/api/admin/inscricoes");
    if (res.ok) return data;
    if (res.status === 503 && data?.fallback) return LocalDB.listInscricoes();
    if (res.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
    throw new Error(data?.error || "Erro ao carregar inscrições.");
  },

  async getInscricao(id) {
    const { res, data } = await this.apiFetch(`/api/admin/inscricoes/${id}`);
    if (res.ok) return data;
    if (res.status === 503 && data?.fallback) return LocalDB.getInscricao(id);
    throw new Error(data?.error || "Inscrição não encontrada.");
  },

  async deleteInscricao(id) {
    const { res, data } = await this.apiFetch(`/api/admin/inscricoes/${id}`, {
      method: "DELETE",
    });
    if (res.ok) return true;
    if (res.status === 503 && data?.fallback) {
      LocalDB.deleteInscricao(id);
      return true;
    }
    throw new Error(data?.error || "Erro ao excluir inscrição.");
  },

  async getStatsInscricoes() {
    const { res, data } = await this.apiFetch("/api/admin/stats");
    if (res.ok) return data;
    if (res.status === 503 && data?.fallback) return LocalDB.getStatsInscricoes();
    throw new Error(data?.error || "Erro ao carregar estatísticas.");
  },
};
