// ── SUPABASE ──────────────────────────────────
const SUPABASE_URL = 'https://wnhljiftitkopwtmayzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduaGxqaWZ0aXRrb3B3dG1heXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMDM3MDYsImV4cCI6MjA5NTc3OTcwNn0.NEhRrIZqs_bjqbvyrsDgFESOVK4lSHFPFTRGHsLgs-U';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
};

const db = {

  async getProjects() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?order=created_at.desc`, { headers });
    const data = await res.json();
    // remap db columns back to the shape the site expects
    return data.map(p => ({
      id:       p.id,
      title:    p.title,
      type:     p.type,
      desc:     p.description,
      tags:     p.tags || [],
      date:     p.date || '',
      link:     p.link || '#',
      featured: p.featured
    }));
  },

  async addProject(p) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        title:       p.title,
        type:        p.type,
        description: p.desc,
        tags:        p.tags,
        date:        p.date,
        link:        p.link,
        featured:    p.featured
      })
    });
    const data = await res.json();
    return data[0].id;
  },

  async updateProject(p) {
    await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${p.id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=representation' },
      body: JSON.stringify({
        title:       p.title,
        type:        p.type,
        description: p.desc,
        tags:        p.tags,
        date:        p.date,
        link:        p.link,
        featured:    p.featured
      })
    });
  },

  async deleteProject(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
      method: 'DELETE',
      headers
    });
  },

  async getPhoto() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.profile_photo`, { headers });
    const data = await res.json();
    return data.length ? data[0].value : null;
  },

  async savePhoto(base64) {
    await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
      body: JSON.stringify({ key: 'profile_photo', value: base64 })
    });
  }

};