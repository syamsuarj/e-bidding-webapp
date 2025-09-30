import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout.jsx";

// Default roles (disesuaikan dengan kebutuhan: superadmin, admin, buyer, business manager)
const defaultRoles = [
  { id: "superadmin", name: "Superadmin", description: "Akses penuh sistem" },
  { id: "admin", name: "Admin", description: "Pengelola operasional" },
  {
    id: "buyer",
    name: "Buyer",
    description: "Calon pembeli yang mengikuti lelang",
  },
  {
    id: "business_manager",
    name: "Business Manager",
    description: "User divisi bisnis",
  },
];

// Batasi agar role hanya empat ini (saat merge data lama)
const ALLOWED_ROLE_IDS = new Set(defaultRoles.map((r) => r.id));

// Default permissions (modular & aksi granular)
const defaultPermissions = [
  // Auctions
  { id: "auctions.view", name: "Lihat Lelang" },
  { id: "auctions.create", name: "Buat Lelang" },
  { id: "auctions.edit", name: "Ubah Lelang" },
  { id: "auctions.delete", name: "Hapus Lelang" },
  { id: "auctions.publish", name: "Publish Lelang" },
  { id: "auctions.open_bidding", name: "Buka Bidding" },
  { id: "auctions.close_bidding", name: "Tutup Bidding" },
  { id: "auctions.set_winner", name: "Tetapkan Pemenang" },
  { id: "auctions.cancel", name: "Batalkan Lelang" },
  { id: "auctions.manage_documents", name: "Kelola Dokumen Lelang" },
  { id: "auctions.place_bid", name: "Pasang Bid" }, // untuk menjaga analogi dengan fitur buyer

  // Participants
  { id: "participants.view", name: "Lihat Peserta" },
  { id: "participants.approve", name: "Setujui Peserta" },
  { id: "participants.reject", name: "Tolak Peserta" },
  { id: "participants.suspend", name: "Suspend Peserta" },
  { id: "participants.invite", name: "Undang Peserta" },
  { id: "participants.manage_documents", name: "Kelola Dokumen Peserta" },

  // Users
  { id: "users.view", name: "Lihat Pengguna" },
  { id: "users.create", name: "Buat Pengguna" },
  { id: "users.edit", name: "Ubah Pengguna" },
  { id: "users.deactivate", name: "Nonaktifkan Pengguna" },
  { id: "users.reset_password", name: "Reset Password" },
  { id: "users.manage_roles", name: "Kelola Role Pengguna" },

  // PKS
  { id: "pks.view", name: "Lihat PKS" },
  { id: "pks.create", name: "Buat PKS" },
  { id: "pks.edit", name: "Ubah PKS" },
  { id: "pks.upload", name: "Upload Dokumen PKS" },
  { id: "pks.approve", name: "Setujui PKS" },
  { id: "pks.reject", name: "Tolak PKS" },
  { id: "pks.sign", name: "Tandatangani PKS" },
  { id: "pks.publish", name: "Publish PKS" },

  // Policies
  { id: "policies.view", name: "Lihat Kebijakan" },
  { id: "policies.create", name: "Buat Kebijakan" },
  { id: "policies.edit", name: "Ubah Kebijakan" },
  { id: "policies.publish", name: "Publish Kebijakan" },
  { id: "policies.archive", name: "Arsipkan Kebijakan" },

  // Reports & Export
  { id: "reports.view", name: "Lihat Laporan" },
  { id: "reports.finance_view", name: "Lihat Laporan Finansial" },
  { id: "export.data", name: "Ekspor Data" },

  // System & Misc
  { id: "settings.manage", name: "Kelola Pengaturan" },
  { id: "role_matrix.manage", name: "Kelola Role Matrix" },
  { id: "audit_logs.view", name: "Lihat Audit Logs" },
  { id: "notifications.send", name: "Kirim Notifikasi" },

  // Produk (untuk kompatibilitas dengan konsep lama)
  { id: "products.manage", name: "Kelola Produk" },

  // Logs
  { id: "logs.view", name: "Lihat Logs" },
  { id: "logs.system.view", name: "Lihat System Logs" },
  { id: "logs.activity.view", name: "Lihat Activity Logs" },
  { id: "logs.other.view", name: "Lihat Logs Lainnya" },
  { id: "logs.export", name: "Export Logs" },
  { id: "logs.clear", name: "Hapus Logs" },
];

// Build default matrix programmatically
const buildDefaultMatrix = (roles, permissions) => {
  const permIds = permissions.map((p) => p.id);
  const matrix = {};
  const setAllFalse = (roleId) => {
    matrix[roleId] = {};
    permIds.forEach((pid) => (matrix[roleId][pid] = false));
  };
  roles.forEach((r) => setAllFalse(r.id));
  const allow = (roleId, ids) => {
    if (!matrix[roleId]) return;
    ids.forEach((id) => {
      if (permIds.includes(id)) matrix[roleId][id] = true;
    });
  };

  // superadmin: semua true
  if (roles.some((r) => r.id === "superadmin")) {
    matrix["superadmin"] = {};
    permIds.forEach((pid) => (matrix["superadmin"][pid] = true));
  }

  // Admin operasional: pengguna dasar, lihat modul utama, bukan settings/role matrix
  if (roles.some((r) => r.id === "admin")) {
    allow("admin", [
      "users.view",
      "users.create",
      "users.edit",
      "users.deactivate",
      "users.reset_password",
      // modul view
      "auctions.view",
      "participants.view",
      "pks.view",
      "policies.view",
      "reports.view",
      "audit_logs.view",
      // logs basic
      "logs.view",
    ]);
  }

  // Buyer portal
  if (roles.some((r) => r.id === "buyer")) {
    allow("buyer", ["auctions.view", "auctions.place_bid"]);
  }

  // Business Manager: kelola auction (tanpa delete/cancel), moderasi peserta, akses laporan/ekspor
  if (roles.some((r) => r.id === "business_manager")) {
    allow("business_manager", [
      // Auctions
      "auctions.view",
      "auctions.create",
      "auctions.edit",
      "auctions.publish",
      "auctions.open_bidding",
      "auctions.close_bidding",
      "auctions.set_winner",
      "auctions.manage_documents",
      // Participants moderation
      "participants.view",
      "participants.approve",
      "participants.reject",
      "participants.invite",
      "participants.manage_documents",
      // Read-only on PKS & Policies
      "pks.view",
      "policies.view",
      // Reports & export
      "reports.view",
      "export.data",
      // Logs basic view
      "logs.view",
    ]);
  }

  return matrix;
};

// Base default matrix for this version
const defaultMatrix = buildDefaultMatrix(defaultRoles, defaultPermissions);

const STORAGE_KEY = "apas_admin_role_matrix_v1";

const AdminRoleMatrix = () => {
  const [roles, setRoles] = useState(defaultRoles);
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [filter, setFilter] = useState("");
  const [groupKey, setGroupKey] = useState("*"); // '*' = Semua

  useEffect(() => {
    // auth guard
    if (sessionStorage.getItem("apas_admin_authed") !== "1") {
      window.history.replaceState(null, "", "/admin/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  useEffect(() => {
    // Merge saved data dengan defaults lalu batasi hanya role yang diizinkan
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // normalize legacy role ids (super_admin -> superadmin)
        const rawSavedRoles = Array.isArray(parsed?.roles) ? parsed.roles : [];
        const savedRoles = rawSavedRoles.map((r) =>
          r?.id === "super_admin"
            ? { ...r, id: "superadmin", name: r.name || "Superadmin" }
            : r
        );
        const savedPermissions = Array.isArray(parsed?.permissions)
          ? parsed.permissions
          : [];
        let savedMatrix =
          parsed?.matrix && typeof parsed.matrix === "object"
            ? parsed.matrix
            : {};

        // migrate matrix key as well
        if (savedMatrix["super_admin"]) {
          savedMatrix = {
            ...savedMatrix,
            superadmin: { ...savedMatrix["super_admin"] },
          };
          delete savedMatrix["super_admin"];
        }

        // merge helper by id (prefer saved values for name/desc)
        const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
        const savedRolesMap = byId(savedRoles);
        const defaultRolesMap = byId(defaultRoles);
        let mergedRoles = [
          // keep saved order first
          ...savedRoles,
          // append default roles not present
          ...defaultRoles.filter((r) => !savedRolesMap[r.id]),
        ].map((r) => ({ ...defaultRolesMap[r.id], ...r }));

        // filter hanya role yang diperbolehkan
        mergedRoles = mergedRoles.filter((r) => ALLOWED_ROLE_IDS.has(r.id));

        const savedPermMap = byId(savedPermissions);
        const defaultPermMap = byId(defaultPermissions);
        const mergedPermissions = [
          ...savedPermissions,
          ...defaultPermissions.filter((p) => !savedPermMap[p.id]),
        ].map((p) => ({ ...defaultPermMap[p.id], ...p }));

        // seed matrix with defaults for merged sets
        const seededDefaults = buildDefaultMatrix(
          mergedRoles,
          mergedPermissions
        );
        const permIds = mergedPermissions.map((p) => p.id);
        const mergedMatrix = {};
        mergedRoles.forEach((r) => {
          mergedMatrix[r.id] = {};
          permIds.forEach((pid) => {
            const savedVal = savedMatrix?.[r.id]?.[pid];
            const defaultVal = seededDefaults?.[r.id]?.[pid];
            mergedMatrix[r.id][pid] =
              typeof savedVal === "boolean"
                ? savedVal
                : typeof defaultVal === "boolean"
                ? defaultVal
                : false;
          });
        });

        // ensure superadmin remains full access if exists
        if (mergedRoles.some((r) => r.id === "superadmin")) {
          permIds.forEach((pid) => (mergedMatrix["superadmin"][pid] = true));
        }

        setRoles(mergedRoles);
        setPermissions(mergedPermissions);
        setMatrix(mergedMatrix);
        return;
      }
    } catch {}
    // Fallback to defaults
    setRoles(defaultRoles);
    setPermissions(defaultPermissions);
    setMatrix(defaultMatrix);
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

  // Grouping helpers
  const GROUP_LABEL = {
    auctions: "Lelang",
    participants: "Peserta",
    users: "Pengguna",
    pks: "PKS",
    policies: "Kebijakan",
    reports_export: "Laporan & Ekspor",
    logs: "Logs",
    system: "Sistem",
    audit: "Audit",
    notifications: "Notifikasi",
    products: "Produk",
    other: "Lainnya",
  };
  const GROUP_ORDER = [
    "auctions",
    "participants",
    "users",
    "pks",
    "policies",
    "reports_export",
    "logs",
    "system",
    "audit",
    "notifications",
    "products",
    "other",
  ];
  const getGroupKeyFromPermId = (id) => {
    if (id.startsWith("auctions.")) return "auctions";
    if (id.startsWith("participants.")) return "participants";
    if (id.startsWith("users.")) return "users";
    if (id.startsWith("pks.")) return "pks";
    if (id.startsWith("policies.")) return "policies";
    if (id.startsWith("reports.") || id === "export.data")
      return "reports_export";
    if (id.startsWith("logs.")) return "logs";
    if (id.startsWith("settings.") || id.startsWith("role_matrix."))
      return "system";
    if (id.startsWith("audit_logs.")) return "audit";
    if (id.startsWith("notifications.")) return "notifications";
    if (id.startsWith("products.")) return "products";
    return "other";
  };

  // Build grouped permissions after text filter and optional group filter
  const { displayGroupKeys, groupMap, indexMap } = useMemo(() => {
    const gm = {};
    filteredPermissions.forEach((p) => {
      const gk = getGroupKeyFromPermId(p.id);
      if (!gm[gk]) gm[gk] = [];
      gm[gk].push(p);
    });
    // order groups and apply group filter
    const keysUsed = GROUP_ORDER.filter((k) => gm[k] && gm[k].length > 0);
    const selectedKeys =
      groupKey === "*" ? keysUsed : keysUsed.filter((k) => k === groupKey);
    // create flattened order to build index map for numbering
    const ordered = [];
    selectedKeys.forEach((k) => gm[k].forEach((p) => ordered.push(p)));
    const im = new Map(ordered.map((p, i) => [p.id, i + 1]));
    return { displayGroupKeys: selectedKeys, groupMap: gm, indexMap: im };
  }, [filteredPermissions, groupKey]);

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
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-4 bg-white border rounded-xl border-slate-200">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center flex-1 gap-2">
                <input
                  type="search"
                  className="w-full max-w-lg px-3 py-2 text-sm border rounded-lg shadow-sm border-slate-300 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Cari permission…"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  className="inline-flex items-center px-3 py-2 text-sm border rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
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

            {/* Group filter chips */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto">
              {["*"]
                .concat(GROUP_ORDER)
                .filter((k) => k === "*" || (groupMap[k] && groupMap[k].length))
                .map((k) => (
                  <button
                    key={k}
                    className={
                      "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm " +
                      (groupKey === k
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50")
                    }
                    onClick={() => setGroupKey(k)}
                  >
                    {k === "*" ? "Semua" : GROUP_LABEL[k]}
                  </button>
                ))}
            </div>

            {/* Table (no inner vertical scroll; let page handle scrolling) */}
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm text-left divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-center w-14 text-slate-700">
                      No.
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700">
                      Permission
                    </th>
                    {roles.map((r) => (
                      <th
                        key={r.id}
                        className="px-3 py-2 font-semibold whitespace-nowrap text-slate-700"
                        title={r.description || ""}
                      >
                        {r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayGroupKeys.map((gk) => (
                    <React.Fragment key={gk}>
                      {/* Group header row */}
                      <tr>
                        <td
                          className="px-3 py-2 font-semibold text-slate-700 bg-slate-50"
                          colSpan={2 + roles.length}
                        >
                          {GROUP_LABEL[gk]}
                        </td>
                      </tr>
                      {groupMap[gk].map((perm) => (
                        <tr key={perm.id}>
                          <td className="px-3 py-2 text-center text-slate-700">
                            {indexMap.get(perm.id)}
                          </td>
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
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={!!matrix[role.id]?.[perm.id]}
                                  onChange={() => toggle(role.id, perm.id)}
                                />
                                <span className="relative h-5 w-9 rounded-full bg-slate-300 transition-colors duration-200 ease-out after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-out peer-checked:bg-emerald-500 peer-checked:after:translate-x-4" />
                              </label>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
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
