const bcrypt = require("bcrypt");
const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    // Check if data already exists
    const existingUsers = await User.countDocuments();
    const existingPharmacies = await Pharmacy.countDocuments();

    if (existingUsers > 0 || existingPharmacies > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    // Create default admin user
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      name: "مدير النظام",
      email: "admin@medfast.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      phone: "0612345678",
      address: "الدار البيضاء، المغرب",
      city: "الدار البيضاء",
      postalCode: "20000",
    });

    // Create default user
    const userPasswordHash = await bcrypt.hash("user123", 10);
    await User.create({
      name: "مستخدم تجريبي",
      email: "user@medfast.com",
      passwordHash: userPasswordHash,
      role: "user",
      phone: "0687654321",
      address: "الرباط، المغرب",
      city: "الرباط",
      postalCode: "10000",
    });

    // Create additional admin users for other pharmacies
    const admin2PasswordHash = await bcrypt.hash("admin123", 10);
    const admin2User = await User.create({
      name: "مدير صيدلية الأمل",
      email: "admin2@medfast.com",
      passwordHash: admin2PasswordHash,
      role: "admin",
      phone: "0522234567",
      address: "حي المعاريف، الدار البيضاء",
      city: "الدار البيضاء",
      postalCode: "20000",
    });

    const admin3PasswordHash = await bcrypt.hash("admin123", 10);
    const admin3User = await User.create({
      name: "مدير صيدلية السلام",
      email: "admin3@medfast.com",
      passwordHash: admin3PasswordHash,
      role: "admin",
      phone: "0522345678",
      address: "شارع الحسن الثاني، الدار البيضاء",
      city: "الدار البيضاء",
      postalCode: "20000",
    });

    // Create sample pharmacies (each admin gets one pharmacy)
    const pharmacy1 = await Pharmacy.create({
      name: "صيدلية النور",
      address: "شارع محمد الخامس، الدار البيضاء",
      phone: "0522123456",
      admin: adminUser._id,
      specialties: ["أدوية عامة", "أدوية الأطفال", "مستحضرات التجميل"],
      workingHours: "8:00 ص - 10:00 م",
      image: "🏪",
      medicines: [
        {
          name: "Paracetamol 500mg",
          description: "مسكن للألم وخافض للحرارة",
          price: 15,
          inStock: true,
        },
        {
          name: "Ibuprofen 400mg",
          description: "مضاد للالتهاب ومسكن للألم",
          price: 25,
          inStock: true,
        },
      ],
    });

    const pharmacy2 = await Pharmacy.create({
      name: "صيدلية الأمل",
      address: "حي المعاريف، الدار البيضاء",
      phone: "0522234567",
      admin: admin2User._id,
      specialties: ["أدوية القلب", "رعاية كبار السن", "أجهزة طبية"],
      workingHours: "9:00 ص - 9:00 م",
      image: "💊",
      medicines: [
        {
          name: "Aspirin 100mg",
          description: "مضاد للتجلط وحماية القلب",
          price: 20,
          inStock: true,
        },
        {
          name: "Vitamin D3",
          description: "مكمل غذائي لفيتامين د",
          price: 35,
          inStock: true,
        },
      ],
    });

    const pharmacy3 = await Pharmacy.create({
      name: "صيدلية السلام",
      address: "شارع الحسن الثاني، الدار البيضاء",
      phone: "0522345678",
      admin: admin3User._id,
      specialties: ["مكملات غذائية", "أعشاب طبية", "منتجات طبيعية"],
      workingHours: "8:30 ص - 9:30 م",
      image: "🌿",
      medicines: [
        {
          name: "Omega 3",
          description: "مكمل غذائي للأحماض الدهنية",
          price: 45,
          inStock: true,
        },
        {
          name: "Multivitamin",
          description: "مكمل غذائي متعدد الفيتامينات",
          price: 55,
          inStock: true,
        },
      ],
    });

    // Update users with their pharmacy references
    await User.findByIdAndUpdate(adminUser._id, { pharmacy: pharmacy1._id });
    await User.findByIdAndUpdate(admin2User._id, { pharmacy: pharmacy2._id });
    await User.findByIdAndUpdate(admin3User._id, { pharmacy: pharmacy3._id });

    console.log("Database seeded successfully!");
    console.log("🔐 Test Accounts Created:");
    console.log("   Admin 1 (صيدلية النور): admin@medfast.com / admin123");
    console.log("   Admin 2 (صيدلية الأمل): admin2@medfast.com / admin123");
    console.log("   Admin 3 (صيدلية السلام): admin3@medfast.com / admin123");
    console.log("   User: user@medfast.com / user123");
    console.log("🏪 Each admin has their own pharmacy with sample medicines");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
