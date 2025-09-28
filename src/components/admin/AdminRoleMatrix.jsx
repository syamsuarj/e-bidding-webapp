import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";

const defaultRoles = [
  {
    id: "buyer",
    name: "Buyer",
    description: "Calon pembeli yang mengikuti lelang",
  },
  { id: "seller", name: "Seller", description: "Penjual komoditas" },
  { id: "auditor", name: "Auditor", description: "Memantau proses lelang" },
  { id: "admin", name: "Admin", description: "Pengelola sistem" },
];

const defaultPermissions = [
  { id: "view_auctions", name: "Lihat Lelang" },
  { id: "place_bid", name: "Pasang Bid" },
  { id: "manage_products", name: "Kelola Produk" },
  { id: "manage_users", name: "Kelola Pengguna" },
  { id: "view_reports", name: "Lihat Laporan" },
];

const defaultMatrix = {
  buyer: {
    view_auctions: true,
    place_bid: true,
    manage_products: false,
    manage_users: false,
    view_reports: false,
  },
  seller: {
    view_auctions: true,
    place_bid: false,
    manage_products: true,
    manage_users: false,
    view_reports: true,
  },
  auditor: {
    view_auctions: true,
    place_bid: false,
    manage_products: false,
    manage_users: false,
    view_reports: true,
  },
  admin: {
    view_auctions: true,
    place_bid: true,
    manage_products: true,
    manage_users: true,
    view_reports: true,
  },
};

const STORAGE_KEY = "apas_admin_role_matrix_v1";

const AdminRoleMatrix = () => {
  const [roles, setRoles] = useState(defaultRoles);
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // auth guard
    if (sessionStorage.getItem("apas_admin_authed") !== "1") {
      window.history.replaceState(null, "", "/admin/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.roles && parsed.permissions && parsed.matrix) {
          setRoles(parsed.roles);
          setPermissions(parsed.permissions);
          setMatrix(parsed.matrix);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const payload = JSON.stringify({ roles, permissions, matrix });
    localStorage.setItem(STORAGE_KEY, payload);
  }, [roles, permissions, matrix]);

  const filteredPermissions = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return permissions;
    return permissions.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [filter, permissions]);

  const toggle = (roleId, permId) => {
    setMatrix((prev) => ({
      ...prev,
      [roleId]: { ...prev[roleId], [permId]: !prev[roleId]?.[permId] },
    }));
  };

  const addRole = () => {
    const name = prompt("Nama role baru:");
    if (!name) return;
    const id = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    if (roles.some((r) => r.id === id)) return alert("Role sudah ada.");
    setRoles((r) => [...r, { id, name, description: "" }]);
    setMatrix((m) => ({
      ...m,
      [id]: Object.fromEntries(permissions.map((p) => [p.id, false])),
    }));
  };

  const addPermission = () => {
    const name = prompt("Nama permission baru:");
    if (!name) return;
    const id = name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    if (permissions.some((p) => p.id === id))
      return alert("Permission sudah ada.");
    setPermissions((p) => [...p, { id, name }]);
    setMatrix((m) => {
      const copy = { ...m };
      Object.keys(copy).forEach((rid) => {
        copy[rid] = { ...copy[rid], [id]: false };
      });
      return copy;
    });
  };

  const resetDefaults = () => {
    if (!confirm("Kembalikan ke pengaturan default?")) return;
    setRoles(defaultRoles);
    setPermissions(defaultPermissions);
    setMatrix(defaultMatrix);
  };

  return (
    <AdminLayout>
      <section className="section">
        <div className="card admin-scroll-table-card" data-reveal>
          <div className="card__toolbar">
            <div className="toolbar-left">
              <input
                type="search"
                className="input"
                placeholder="Cari permission…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="toolbar-right">
              <button className="btn btn--ghost" onClick={addRole}>
                Tambah Role
              </button>
              <button className="btn btn--ghost" onClick={addPermission}>
                Tambah Permission
              </button>
              <button className="btn btn--secondary" onClick={resetDefaults}>
                Reset Default
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Permission</th>
                  {roles.map((r) => (
                    <th key={r.id} title={r.description || ""}>
                      {r.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.map((perm) => (
                  <tr key={perm.id}>
                    <td>
                      <div className="perm-cell">
                        <div className="perm-name">{perm.name}</div>
                        <div className="perm-id">{perm.id}</div>
                      </div>
                    </td>
                    {roles.map((role) => (
                      <td key={`${role.id}_${perm.id}`} className="cell-center">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={!!matrix[role.id]?.[perm.id]}
                            onChange={() => toggle(role.id, perm.id)}
                          />
                          <span className="slider" />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminRoleMatrix;
