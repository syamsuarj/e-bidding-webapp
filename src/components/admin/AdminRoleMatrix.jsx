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
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="search"
                  className="w-full max-w-lg rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Cari permission…"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={addRole}
                >
                  Tambah Role
                </button>
                <button
                  className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={addPermission}
                >
                  Tambah Permission
                </button>
                <button
                  className="inline-flex items-center rounded-lg bg-gradient-to-br from-secondary to-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(94,203,102,0.55)] transition hover:-translate-y-px hover:shadow-[0_30px_60px_-32px_rgba(94,203,102,0.5)]"
                  onClick={resetDefaults}
                >
                  Reset Default
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Permission
                    </th>
                    {roles.map((r) => (
                      <th
                        key={r.id}
                        className="whitespace-nowrap px-3 py-2 font-semibold text-slate-700"
                        title={r.description || ""}
                      >
                        {r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPermissions.map((perm) => (
                    <tr key={perm.id}>
                      <td className="px-3 py-2">
                        <div className="min-w-[220px]">
                          <div className="font-medium text-slate-800">
                            {perm.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {perm.id}
                          </div>
                        </div>
                      </td>
                      {roles.map((role) => (
                        <td
                          key={`${role.id}_${perm.id}`}
                          className="px-3 py-2 text-center"
                        >
                          <label className="inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={!!matrix[role.id]?.[perm.id]}
                              onChange={() => toggle(role.id, perm.id)}
                            />
                            <span className="relative h-5 w-9 rounded-full bg-slate-300 transition-colors duration-200 ease-out after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-out peer-checked:bg-emerald-500 peer-checked:after:translate-x-4" />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminRoleMatrix;
