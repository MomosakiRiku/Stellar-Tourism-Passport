import React, { useState, useEffect } from "react";
import "./index.css";
import { useWallet } from "./hooks/useWallet";
import { useContract, LANDMARKS, COLLECTIONS } from "./hooks/useContract";
import { CONTRACT_ID, NETWORK } from "./contracts/tourism-passport";

// ==================== COMPONENTS ====================

// Wallet Connect Button
function WalletConnect({
  address,
  connected,
  loading,
  onConnect,
  onDisconnect,
  shortenAddress,
}: any) {
  if (loading) {
    return (
      <button className="wallet-btn" disabled>
        <div className="spinner" style={{ width: 16, height: 16 }} />
        Đang kết nối...
      </button>
    );
  }

  if (connected && address) {
    return (
      <button className="wallet-btn connected" onClick={onDisconnect}>
        <span className="wallet-dot" />
        {shortenAddress(address)}
      </button>
    );
  }

  return (
    <button className="btn btn-primary btn-sm" onClick={onConnect}>
      🔗 Kết nối Freighter
    </button>
  );
}

// Toast notification
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
      }}
    >
      <div className={`toast toast-${type}`}>
        <span>
          {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
        </span>
        {message}
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            marginLeft: 8,
            fontSize: "1.1rem",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Stamp Card Component
function StampCard({
  landmark,
  stampTime,
}: {
  landmark: any;
  stampTime?: number;
}) {
  const hasStamp = stampTime && stampTime > 0;
  const dateStr = hasStamp
    ? new Date(stampTime * 1000).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="stamp-card">
      <div
        className="stamp-card-image"
        style={{
          background: `linear-gradient(to bottom, transparent 60%, rgba(6,6,15,0.9)), url(${landmark.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {hasStamp && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(0, 229, 160, 0.2)",
              border: "2px solid rgba(0, 229, 160, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              backdropFilter: "blur(8px)",
            }}
          >
            ✓
          </div>
        )}
      </div>
      <div className="stamp-card-body">
        <div className="stamp-card-title">
          {landmark.icon} {landmark.name}
        </div>
        <div className="stamp-card-location">📍 {landmark.location}</div>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            marginBottom: "var(--spacing-md)",
            lineHeight: 1.5,
          }}
        >
          {landmark.description}
        </p>
        <div className="stamp-card-footer">
          <span
            className={`stamp-badge ${hasStamp ? "collected" : "uncollected"}`}
          >
            {hasStamp ? "✓ Đã thu thập" : "○ Chưa đến"}
          </span>
          {dateStr && <span className="stamp-card-time">{dateStr}</span>}
        </div>
      </div>
    </div>
  );
}

// ==================== PAGES ====================

// Dashboard Page
function DashboardPage({
  stamps,
  connected,
}: {
  stamps: Record<number, number>;
  connected: boolean;
}) {
  const stampCount = Object.keys(stamps).length;
  const totalLandmarks = LANDMARKS.length;
  const completedCollections = COLLECTIONS.filter((c) =>
    c.requiredLandmarks.every((id) => stamps[id])
  ).length;

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div
        className="glass-card-static"
        style={{
          marginBottom: "var(--spacing-xl)",
          padding: "var(--spacing-2xl)",
          background:
            "linear-gradient(135deg, rgba(108, 99, 255, 0.15), rgba(0, 212, 255, 0.1))",
          borderColor: "var(--border-accent)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            fontSize: "8rem",
            opacity: 0.08,
          }}
        >
          🌏
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: "var(--spacing-sm)",
          }}
        >
          Xin chào, Nhà thám hiểm! 👋
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            maxWidth: 600,
          }}
        >
          Khám phá các địa danh du lịch nổi tiếng Việt Nam, thu thập con dấu và
          nhận thưởng trên blockchain Stellar.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid stagger-children">
        <div className="stat-card">
          <div className="stat-card-icon purple">🗺️</div>
          <div className="stat-card-value">{stampCount}</div>
          <div className="stat-card-label">Con dấu đã thu thập</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon blue">📍</div>
          <div className="stat-card-value">{totalLandmarks}</div>
          <div className="stat-card-label">Địa danh có sẵn</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon gold">🏆</div>
          <div className="stat-card-value">{completedCollections}</div>
          <div className="stat-card-label">Bộ sưu tập hoàn thành</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon green">
            {stampCount > 0
              ? `${Math.round((stampCount / totalLandmarks) * 100)}%`
              : "0%"}
          </div>
          <div className="stat-card-value">
            {stampCount}/{totalLandmarks}
          </div>
          <div className="stat-card-label">Tiến trình</div>
        </div>
      </div>

      {/* Collections Progress */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">📚 Bộ sưu tập</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "var(--spacing-lg)",
          }}
          className="stagger-children"
        >
          {COLLECTIONS.map((collection) => {
            const collected = collection.requiredLandmarks.filter(
              (id) => stamps[id]
            ).length;
            const total = collection.requiredLandmarks.length;
            const progress = (collected / total) * 100;
            const isComplete = collected === total;

            return (
              <div className="glass-card" key={collection.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-md)",
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{collection.icon}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      {collection.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {collection.description}
                    </div>
                  </div>
                </div>
                <div className="collection-progress">
                  <div className="collection-header">
                    <span className="collection-title">
                      {isComplete ? "✅ Hoàn thành!" : "Đang thực hiện"}
                    </span>
                    <span className="collection-count">
                      {collected}/{total}
                    </span>
                  </div>
                  <div className="collection-progress-bar">
                    <div
                      className="collection-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--accent-gold)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  🎁 {collection.reward}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Stamps */}
      {stampCount > 0 && (
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">🕐 Con dấu gần đây</h3>
          </div>
          <div className="glass-card-static">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Địa danh</th>
                  <th>Địa điểm</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stamps)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([idStr, time]) => {
                    const id = Number(idStr);
                    const landmark = LANDMARKS.find((l) => l.id === id);
                    if (!landmark) return null;
                    return (
                      <tr key={id}>
                        <td>
                          {landmark.icon} {landmark.name}
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>
                          {landmark.location}
                        </td>
                        <td style={{ color: "var(--text-secondary)" }}>
                          {new Date(time * 1000).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Not connected state */}
      {!connected && (
        <div className="glass-card-static" style={{ textAlign: "center", padding: "var(--spacing-2xl)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-md)" }}>🔗</div>
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "var(--spacing-sm)" }}>
            Kết nối ví để bắt đầu
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Kết nối Freighter Wallet để xem stamps và bộ sưu tập của bạn
          </p>
        </div>
      )}
    </div>
  );
}

// Explore Page
function ExplorePage({ stamps }: { stamps: Record<number, number> }) {
  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">🌏 Khám phá địa danh</h3>
        <div className="network-badge">
          <span className="network-badge-dot" />
          Stellar Testnet
        </div>
      </div>
      <div className="landmark-grid stagger-children">
        {LANDMARKS.map((landmark) => (
          <StampCard
            key={landmark.id}
            landmark={landmark}
            stampTime={stamps[landmark.id]}
          />
        ))}
      </div>
    </div>
  );
}

// My Passport Page
function MyPassportPage({ stamps, address }: { stamps: Record<number, number>; address: string | null }) {
  const collectedLandmarks = LANDMARKS.filter((l) => stamps[l.id]);
  
  if (!address) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔗</div>
        <div className="empty-state-title">Kết nối ví</div>
        <div className="empty-state-text">
          Vui lòng kết nối Freighter Wallet để xem hộ chiếu du lịch của bạn
        </div>
      </div>
    );
  }

  if (collectedLandmarks.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="section-header">
          <h3 className="section-title">🛂 Hộ chiếu của tôi</h3>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">Chưa có con dấu nào</div>
          <div className="empty-state-text">
            Hãy bắt đầu hành trình khám phá các địa danh du lịch và thu thập con dấu!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">🛂 Hộ chiếu của tôi</h3>
        <span
          className="stamp-badge collected"
          style={{ fontSize: "0.85rem", padding: "6px 16px" }}
        >
          {collectedLandmarks.length} con dấu
        </span>
      </div>

      {/* Passport Stamps Visual */}
      <div
        className="glass-card-static"
        style={{
          marginBottom: "var(--spacing-xl)",
          padding: "var(--spacing-xl)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--spacing-lg)",
            justifyContent: "center",
          }}
          className="stagger-children"
        >
          {LANDMARKS.map((landmark) => {
            const hasStamp = stamps[landmark.id];
            return (
              <div
                key={landmark.id}
                style={{ textAlign: "center", width: 100 }}
              >
                <div
                  className={`stamp-visual ${hasStamp ? "active" : "inactive"}`}
                  style={{ borderColor: hasStamp ? "var(--accent-emerald)" : undefined }}
                >
                  {landmark.icon}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: hasStamp
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                    fontWeight: hasStamp ? 500 : 400,
                  }}
                >
                  {landmark.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collected stamps detail */}
      <div className="section-header">
        <h3 className="section-title">📋 Chi tiết con dấu</h3>
      </div>
      <div className="landmark-grid stagger-children">
        {collectedLandmarks.map((landmark) => (
          <StampCard
            key={landmark.id}
            landmark={landmark}
            stampTime={stamps[landmark.id]}
          />
        ))}
      </div>
    </div>
  );
}

// Rewards Page
function RewardsPage({
  stamps,
  address,
  contract,
  signTransaction,
}: {
  stamps: Record<number, number>;
  address: string | null;
  contract: ReturnType<typeof useContract>;
  signTransaction: any;
}) {
  const [claimedRewards, setClaimedRewards] = useState<Record<number, boolean>>({});

  const handleClaimReward = async (collection: any) => {
    if (!address) return;
    const success = await contract.claimReward(
      address,
      address,
      collection.id,
      collection.requiredLandmarks,
      signTransaction
    );
    if (success) {
      setClaimedRewards((prev) => ({ ...prev, [collection.id]: true }));
    }
  };

  if (!address) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔗</div>
        <div className="empty-state-title">Kết nối ví</div>
        <div className="empty-state-text">
          Vui lòng kết nối ví để xem và nhận phần thưởng
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">🏆 Phần thưởng</h3>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "var(--spacing-lg)",
        }}
        className="stagger-children"
      >
        {COLLECTIONS.map((collection) => {
          const collected = collection.requiredLandmarks.filter(
            (id) => stamps[id]
          ).length;
          const total = collection.requiredLandmarks.length;
          const isComplete = collected === total;
          const isClaimed = claimedRewards[collection.id];

          return (
            <div className="reward-card" key={collection.id}>
              <div className="reward-icon">{collection.icon}</div>
              <div className="reward-title">{collection.name}</div>
              <div className="reward-description">
                {collection.description}
              </div>
              <div className="collection-progress" style={{ marginBottom: "var(--spacing-md)" }}>
                <div className="collection-progress-bar">
                  <div
                    className="collection-progress-fill"
                    style={{ width: `${(collected / total) * 100}%` }}
                  />
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginTop: 4,
                  }}
                >
                  {collected}/{total} địa danh
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--accent-gold)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                🎁 {collection.reward}
              </div>
              {isClaimed ? (
                <button className="btn btn-secondary" disabled>
                  ✅ Đã nhận thưởng
                </button>
              ) : isComplete ? (
                <button
                  className="btn btn-success"
                  onClick={() => handleClaimReward(collection)}
                  disabled={contract.loading}
                >
                  {contract.loading ? (
                    <>
                      <div className="spinner" style={{ width: 16, height: 16 }} />
                      Đang xử lý...
                    </>
                  ) : (
                    "🎉 Nhận thưởng"
                  )}
                </button>
              ) : (
                <button className="btn btn-secondary" disabled>
                  🔒 Cần {total - collected} dấu nữa
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Admin Page
function AdminPage({
  address,
  contract,
  signTransaction,
}: {
  address: string | null;
  contract: ReturnType<typeof useContract>;
  signTransaction: any;
}) {
  const [activeTab, setActiveTab] = useState<"landmark" | "stamp">("landmark");
  const [landmarkId, setLandmarkId] = useState("");
  const [managerAddress, setManagerAddress] = useState("");
  const [travelerAddress, setTravelerAddress] = useState("");
  const [stampLandmarkId, setStampLandmarkId] = useState("");

  if (!address) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔐</div>
        <div className="empty-state-title">Kết nối ví Admin</div>
        <div className="empty-state-text">
          Vui lòng kết nối ví admin để quản trị hệ thống
        </div>
      </div>
    );
  }

  const handleSetLandmarkAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !landmarkId || !managerAddress) return;
    const success = await contract.setLandmarkAdmin(
      address,
      address,
      Number(landmarkId),
      managerAddress,
      signTransaction
    );
    if (success) {
      setLandmarkId("");
      setManagerAddress("");
    }
  };

  const handleIssueStamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !travelerAddress || !stampLandmarkId) return;
    const success = await contract.issueStamp(
      address,
      address,
      travelerAddress,
      Number(stampLandmarkId),
      signTransaction
    );
    if (success) {
      setTravelerAddress("");
      setStampLandmarkId("");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">⚙️ Quản trị hệ thống</h3>
        <span className="address">{address.slice(0, 8)}...{address.slice(-8)}</span>
      </div>

      {/* Contract Info */}
      <div
        className="glass-card-static"
        style={{ marginBottom: "var(--spacing-xl)" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--spacing-md)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              Contract ID
            </div>
            <div className="address" style={{ wordBreak: "break-all" }}>
              {CONTRACT_ID}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              Network
            </div>
            <div className="network-badge">
              <span className="network-badge-dot" />
              {NETWORK}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        <button
          className={`tab-item ${activeTab === "landmark" ? "active" : ""}`}
          onClick={() => setActiveTab("landmark")}
        >
          🏛️ Phân quyền địa danh
        </button>
        <button
          className={`tab-item ${activeTab === "stamp" ? "active" : ""}`}
          onClick={() => setActiveTab("stamp")}
        >
          🗿 Cấp dấu
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "landmark" ? (
        <div className="glass-card-static animate-fade-in">
          <h4
            style={{
              fontFamily: "var(--font-display)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            Phân quyền Admin cho Địa danh
          </h4>
          <form onSubmit={handleSetLandmarkAdmin}>
            <div className="form-group">
              <label className="form-label">ID Địa danh</label>
              <select
                className="form-input"
                value={landmarkId}
                onChange={(e) => setLandmarkId(e.target.value)}
                required
              >
                <option value="">-- Chọn địa danh --</option>
                {LANDMARKS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.icon} {l.name} (ID: {l.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Địa chỉ Manager</label>
              <input
                className="form-input"
                type="text"
                placeholder="G..."
                value={managerAddress}
                onChange={(e) => setManagerAddress(e.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={contract.loading}
            >
              {contract.loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                  Đang xử lý...
                </>
              ) : (
                "✅ Phân quyền"
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-card-static animate-fade-in">
          <h4
            style={{
              fontFamily: "var(--font-display)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            Cấp dấu cho Du khách
          </h4>
          <form onSubmit={handleIssueStamp}>
            <div className="form-group">
              <label className="form-label">Địa chỉ Du khách</label>
              <input
                className="form-input"
                type="text"
                placeholder="G..."
                value={travelerAddress}
                onChange={(e) => setTravelerAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Địa danh</label>
              <select
                className="form-input"
                value={stampLandmarkId}
                onChange={(e) => setStampLandmarkId(e.target.value)}
                required
              >
                <option value="">-- Chọn địa danh --</option>
                {LANDMARKS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.icon} {l.name} (ID: {l.id})
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={contract.loading}
            >
              {contract.loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                  Đang xử lý...
                </>
              ) : (
                "🗿 Cấp dấu"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ==================== MAIN APP ====================
type Page = "dashboard" | "explore" | "passport" | "rewards" | "admin";

export default function App() {
  const wallet = useWallet();
  const contract = useContract();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [stamps, setStamps] = useState<Record<number, number>>({});
  const [loadingStamps, setLoadingStamps] = useState(false);

  // Load stamps when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      setLoadingStamps(true);
      contract
        .checkAllStamps(wallet.address)
        .then(setStamps)
        .finally(() => setLoadingStamps(false));
    } else {
      setStamps({});
    }
  }, [wallet.connected, wallet.address]);

  const navItems = [
    { id: "dashboard" as Page, icon: "📊", label: "Dashboard" },
    { id: "explore" as Page, icon: "🌏", label: "Khám phá" },
    { id: "passport" as Page, icon: "🛂", label: "Hộ chiếu" },
    { id: "rewards" as Page, icon: "🏆", label: "Phần thưởng" },
  ];

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard";
      case "explore":
        return "Khám phá địa danh";
      case "passport":
        return "Hộ chiếu du lịch";
      case "rewards":
        return "Phần thưởng";
      case "admin":
        return "Quản trị";
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌍</div>
          <div className="sidebar-logo-text">Tourism Passport</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu chính</div>
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`sidebar-nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}

          <div className="sidebar-section-label">Quản trị</div>
          <div
            className={`sidebar-nav-item ${currentPage === "admin" ? "active" : ""}`}
            onClick={() => setCurrentPage("admin")}
          >
            <span className="sidebar-nav-icon">⚙️</span>
            <span>Admin Panel</span>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "var(--spacing-md)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div className="network-badge" style={{ width: "100%", justifyContent: "center" }}>
            <span className="network-badge-dot" />
            Stellar Testnet
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <h1 className="header-title">{getPageTitle()}</h1>
          <div className="header-actions">
            {loadingStamps && (
              <div className="loading-overlay" style={{ padding: 0 }}>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Loading...
                </span>
              </div>
            )}
            <WalletConnect
              address={wallet.address}
              connected={wallet.connected}
              loading={wallet.loading}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}
              shortenAddress={wallet.shortenAddress}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {currentPage === "dashboard" && (
            <DashboardPage stamps={stamps} connected={wallet.connected} />
          )}
          {currentPage === "explore" && <ExplorePage stamps={stamps} />}
          {currentPage === "passport" && (
            <MyPassportPage stamps={stamps} address={wallet.address} />
          )}
          {currentPage === "rewards" && (
            <RewardsPage
              stamps={stamps}
              address={wallet.address}
              contract={contract}
              signTransaction={wallet.signTransaction}
            />
          )}
          {currentPage === "admin" && (
            <AdminPage
              address={wallet.address}
              contract={contract}
              signTransaction={wallet.signTransaction}
            />
          )}
        </div>
      </main>

      {/* Toast Notifications */}
      {contract.success && (
        <Toast
          message={contract.success}
          type="success"
          onClose={contract.clearMessages}
        />
      )}
      {contract.error && (
        <Toast
          message={contract.error}
          type="error"
          onClose={contract.clearMessages}
        />
      )}
      {wallet.error && (
        <Toast
          message={wallet.error}
          type="error"
          onClose={() => {}}
        />
      )}
    </div>
  );
}
