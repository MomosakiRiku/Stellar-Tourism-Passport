# Tourism Passport (Hộ chiếu Du lịch số)

**A decentralized, interactive Web3 travel passport and loyalty rewards system built on Stellar Soroban.**

---

## 📖 Description

Traditional travel rewards programs are fragmented, siloed, and lack a sense of true ownership or permanence. **Tourism Passport** solves this by leveraging the speed, ultra-low fees, and robust smart contract capabilities of the **Stellar Blockchain (Soroban)**.

Travelers can collect permanent, tamper-proof, cryptographic stamps for the famous landmarks they visit. Complete a group of landmarks (e.g., historical heritage sites or natural wonders) to automatically complete a collection and claim rewards like XLM and specialized travel NFTs directly to your Freighter wallet.

This system provides:
- **For Travelers:** A beautiful, digital visa passport with verifiable travel proofs and real rewards.
- **For Tourism Boards:** An administrative protocol to securely delegate local managers to stamp passports and transparently reward visitors.

---

## ⚡ Features

### 1. Smart Contract Logic (Soroban / Rust)
- **Authorized Initialization (`init`):** Secure initialization designating the root administrator.
- **Delegated Landmark Management (`set_landmark_admin`):** Allows the administrator to delegate check-in/stamping rights to specific manager accounts for specific landmarks.
- **Cryptographic Stamping (`issue_stamp`):** Registered managers can issue stamps containing timestamps for travelers who physically check in at their landmarks.
- **On-chain Collection Verification (`verify_collection`):** Smart contract checks if a traveler possesses all required stamps for a thematic collection.
- **Instantiated Rewards (`claim_reward`):** Automatic validation and direct on-chain reward distribution upon completion of thematic landmark sets.

### 2. Premium React Frontend (Vite + TypeScript)
- **Interactive Dashboard:** Live stats displaying stamps collected, available landmarks, completed collections, progress bars, and a history table of recent check-ins.
- **Explore Vietnamese Landmarks:** Beautiful grid featuring 6 iconic Vietnamese destinations (Ha Long Bay, Hoi An, Hue, Phong Nha - Ke Bang, Sapa, Da Lat) with rich descriptions and status tags.
- **Digital Hộ Chiếu (Passport Visa):** Visual visa seals showing active colored stamps and inactive gray stamps, resembling a physical passport book.
- **Thematic Collections & Rewards:** Live claim buttons linked to smart contracts for thematic rewards (e.g., *Central Vietnam Heritage*, *Vietnam Explorer*, *Nature Wonders*).
- **Secure Admin Panel:** Tabbed interface for Root Admin to assign landmark managers and for Landmark Managers to issue stamps to travelers' public keys.
- **Stellar SDK & Freighter Wallet Integration:** Seamless connection, network passphrase validation, transaction preparation, simulation, signing, and submission polling.

---

## ⛓️ Contract Details

- **Contract ID:** `CCFZ6FYNQWAMJTMBIOZ4LN5332ZRRVMZM6YBSFJZRGZPHK2Q4YPRZFIT`
- **Deployer Identity:** `GBRKA6VTQJGIX7PCS25HO6HMOREET7JU4AZSVHBOMK56AEGLC4VBXM3M`
- **Network:** Stellar Testnet
- **Explorer Link:** [Stellar Expert - Testnet Contract CCFZ6FYNQWAMJTMBIOZ4LN5332ZRRVMZM6YBSFJZRGZPHK2Q4YPRZFIT](https://stellar.expert/explorer/testnet/contract/CCFZ6FYNQWAMJTMBIOZ4LN5332ZRRVMZM6YBSFJZRGZPHK2Q4YPRZFIT)

### 📸 Smart Contract Transactions & Interaction Screenshot
*(Double-click README on GitHub, press Edit, and paste/upload your contract's invoke/deploy screenshot below)*

![Screenshot](https://github.com/user-attachments/assets/4246010a-edc9-40ff-8837-b9b60101199f)

---

## 🚀 Future Scopes

1. **Physical Presence Verification (GPS / NFC / QR):** Integrate mobile GPS or physical NFC beacons at landmarks to generate secure, localized signatures before check-ins are allowed.
2. **SEP-3 NFT Standard Integration:** Mint actual Stellar-native NFTs for completed travel milestones.
3. **Stellar DEX Swap Pools:** Allow travelers to automatically swap their reward tokens (e.g., custom loyalty tokens) into USDC or native fiat anchors directly via path payments.
4. **Social Sharing Integration:** Verifiable travel certificates shared automatically to LinkedIn and X (Twitter) using decentralized metadata.

---

## 👤 Profile

- **Developer:** 24127500 - Nguyễn Đại Phúc
- **Freighter Wallet (Testnet):** `GBRKA6VTQJGIX7PCS25HO6HMOREET7JU4AZSVHBOMK56AEGLC4VBXM3M`
- **Technical Skills:** Rust, Soroban Smart Contracts, TypeScript, React, Vite, Tailwind/Vanilla CSS, DApp Development, Web3 Wallet integration.
