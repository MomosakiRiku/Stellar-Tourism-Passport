#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,                 // Địa chỉ ví quản trị tối cao (Hệ thống)
    LandmarkAdmin(u32),    // Quản trị viên của từng địa danh (ID địa danh -> Address)
    Stamp(Address, u32),   // Con dấu: (Địa chỉ khách -> ID địa danh) -> Thời gian check-in
    Reward(Address, u32),  // Phần thưởng: (Địa chỉ khách -> ID bộ sưu tập) -> Trạng thái nhận
}

#[contract]
pub struct TourismPassport;

#[contractimpl]
impl TourismPassport {
    /// 1. Khởi tạo hệ thống - Thiết lập Admin tổng
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("He thong da duoc khoi tao truoc do!");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// 2. Phân quyền Admin cho từng địa danh (Chỉ Admin tổng mới được gọi)
    pub fn set_landmark_admin(env: Env, admin: Address, landmark_id: u32, landmark_manager: Address) {
        admin.require_auth();
        let master_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Chua co Admin");
        if admin != master_admin {
            panic!("Chi Admin tong moi co quyen phan quyen dia danh");
        }
        env.storage().instance().set(&DataKey::LandmarkAdmin(landmark_id), &landmark_manager);
    }

    /// 3. Cấp dấu (Stamp) - Chỉ Admin của địa danh đó mới được gọi
    pub fn issue_stamp(env: Env, manager: Address, traveler: Address, landmark_id: u32) {
        // Xác thực quyền của người quản lý địa danh
        manager.require_auth();
        let authorized_manager: Address = env.storage().instance()
            .get(&DataKey::LandmarkAdmin(landmark_id))
            .expect("Dia danh nay chua co nguoi quan ly");
        
        if manager != authorized_manager {
            panic!("Ban khong phai quan ly cua dia danh nay");
        }

        // Kiểm tra xem khách đã có dấu này chưa (tránh cấp trùng)
        let key = DataKey::Stamp(traveler.clone(), landmark_id);
        if env.storage().persistent().has(&key) {
            panic!("Khach da co con dau cua dia danh nay");
        }

        // Lưu con dấu kèm Timestamp (Thời gian thực của mạng Stellar)
        let timestamp = env.ledger().timestamp();
        env.storage().persistent().set(&key, &timestamp);
        
        // Gia hạn thời gian tồn tại của dữ liệu (tránh bị xóa khỏi ledger)
        env.storage().persistent().extend_ttl(&key, 100_000, 500_000);
    }

    /// 4. Kiểm tra bộ sưu tập (Verify Collection)
    /// Trả về true nếu khách có đủ tất cả ID địa danh trong danh sách yêu cầu
    pub fn verify_collection(env: Env, traveler: Address, landmark_ids: Vec<u32>) -> bool {
        for id in landmark_ids.iter() {
            let key = DataKey::Stamp(traveler.clone(), id);
            if !env.storage().persistent().has(&key) {
                return false;
            }
        }
        true
    }

    /// 5. Nhận thưởng khi hoàn thành bộ sưu tập
    pub fn claim_reward(env: Env, traveler: Address, collection_id: u32, required_landmarks: Vec<u32>) {
        traveler.require_auth();

        // 1. Kiểm tra xem đã nhận thưởng bộ sưu tập này chưa
        let reward_key = DataKey::Reward(traveler.clone(), collection_id);
        if env.storage().persistent().has(&reward_key) {
            panic!("Ban da nhan phan thuong cho bo suu tap nay roi");
        }

        // 2. Kiểm tra xem khách đã đi đủ các điểm yêu cầu chưa
        let is_qualified = Self::verify_collection(env.clone(), traveler.clone(), required_landmarks);
        if !is_qualified {
            panic!("Ban chua di du cac diem trong bo suu tap");
        }

        // 3. Đánh dấu đã nhận thưởng
        env.storage().persistent().set(&reward_key, &true);
        env.storage().persistent().extend_ttl(&reward_key, 100_000, 500_000);

        // Lưu ý: Ở đây bạn có thể tích hợp thêm logic chuyển Token hoặc NFT thưởng thực tế.
    }

    /// Hàm View: Kiểm tra thời gian check-in của một địa danh
    pub fn get_stamp_time(env: Env, traveler: Address, landmark_id: u32) -> u64 {
        env.storage().persistent()
            .get(&DataKey::Stamp(traveler, landmark_id))
            .unwrap_or(0)
    }
}