/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.forumLike.deleteMany();
  await prisma.forumComment.deleteMany();
  await prisma.forumTopic.deleteMany();
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.consultationNote.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.roadmapTask.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.financialScore.deleteMany();
  await prisma.financialAssessment.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.consultant.deleteMany();
  await prisma.chatHistory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.template.deleteMany();

  const adminPassword = await bcrypt.hash("Admin1234", 10);
  const consultantPassword = await bcrypt.hash("Konsultan123", 10);
  const userPassword = await bcrypt.hash("Umkm1234", 10);

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Cash Flow", slug: "cash-flow" } }),
    prisma.category.create({ data: { name: "Laporan Keuangan", slug: "laporan-keuangan" } }),
    prisma.category.create({ data: { name: "Investasi", slug: "investasi" } }),
    prisma.category.create({ data: { name: "Pembiayaan", slug: "pembiayaan" } }),
    prisma.category.create({ data: { name: "Syariah", slug: "syariah" } }),
  ]);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Klinik",
      email: "admin@umkm.id",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const consultantUser = await prisma.user.create({
    data: {
      name: "Dewi Konsultan",
      email: "konsultan@umkm.id",
      passwordHash: consultantPassword,
      role: "KONSULTAN",
      consultant: { create: { bio: "Konsultan berpengalaman untuk UMKM.", speciality: "Perencanaan Keuangan" } },
    },
    include: { consultant: true },
  });

  const umkmUser = await prisma.user.create({
    data: {
      name: "Budi UMKM",
      email: "umkm@umkm.id",
      passwordHash: userPassword,
      role: "UMKM",
      businessProfile: {
        create: {
          businessName: "Kedai Kopi Nusantara",
          industry: "Kuliner",
          establishedYear: 2020,
          employeeCount: 5,
          monthlyRevenue: 65000000,
          monthlyProfit: 12000000,
          initialCapital: 25000000,
          location: "Jakarta Selatan",
        },
      },
    },
    include: { businessProfile: true },
  });

  // Add more users for forum interaction testing
  const sariUser = await prisma.user.create({
    data: {
      name: "Sari Batik",
      email: "sari@umkm.id",
      passwordHash: userPassword,
      role: "UMKM",
    },
  });

  const rudiUser = await prisma.user.create({
    data: {
      name: "Rudi Tani",
      email: "rudi@umkm.id",
      passwordHash: userPassword,
      role: "UMKM",
    },
  });

  await prisma.article.createMany({
    data: [
      {
        title: "Mengelola Arus Kas untuk UMKM: Panduan Lengkap dari Nol",
        slug: "mengelola-arus-kas-umkm",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
        excerpt: "Pelajari bagaimana membuat catatan arus kas sederhana untuk memastikan bisnis tetap berjalan. Arus kas yang sehat adalah nafas utama setiap usaha.",
        content: `Arus kas adalah jumlah uang yang masuk dan keluar dari bisnis Anda dalam periode waktu tertentu. Banyak UMKM yang tampaknya untung dari sisi akuntansi, namun gagal karena arus kas yang buruk. Tanpa pengelolaan yang baik, uang bisa habis sebelum pembayaran dari pelanggan datang.

Langkah pertama yang harus dilakukan adalah memisahkan rekening pribadi dan rekening usaha. Jangan pernah mencampur keduanya. Dengan rekening terpisah, Anda bisa melihat dengan jelas berapa uang usaha yang sebenarnya, tanpa terganggu pengeluaran pribadi.

Langkah kedua adalah mencatat setiap transaksi, sekecil apapun. Catat uang masuk dari penjualan, uang keluar untuk bahan baku, gaji karyawan, sewa tempat, dan biaya operasional lainnya. Anda bisa menggunakan buku kas sederhana atau aplikasi seperti BukuKas yang tersedia gratis di smartphone.

Langkah ketiga adalah membuat laporan arus kas mingguan. Setiap akhir minggu, hitung total uang masuk dan uang keluar. Jika uang keluar lebih besar dari masuk, segera cari penyebabnya. Apakah ada piutang yang belum dibayar? Apakah ada pengeluaran yang bisa ditunda?

Tips tambahan: selalu siapkan cadangan kas minimal 3 bulan pengeluaran operasional. Cadangan ini akan menjadi penyelamat ketika ada kondisi darurat seperti pandemi atau kerusakan mesin. Dengan arus kas yang terkelola dengan baik, bisnis UMKM Anda akan lebih tahan terhadap goncangan ekonomi.`,
        published: true,
        categoryId: categories[0].id,
        authorId: admin.id,
      },
      {
        title: "Cara Membuat Laporan Keuangan Sederhana untuk Pemula",
        slug: "laporan-keuangan-sederhana",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        excerpt: "Langkah-langkah membuat neraca, laba rugi, dan arus kas untuk usaha kecil menengah. Tidak perlu jadi akuntan untuk bisa membuatnya.",
        content: `Banyak pelaku UMKM merasa takut dengan laporan keuangan karena dianggap rumit. Padahal, laporan keuangan yang sederhana pun sudah sangat membantu untuk mengetahui kondisi bisnis Anda. Tiga laporan utama yang harus Anda kuasai adalah: laporan laba rugi, neraca, dan laporan arus kas.

Laporan Laba Rugi

Laporan ini menunjukkan apakah bisnis Anda untung atau rugi. Caranya sangat sederhana: kurangkan total pendapatan dari total pengeluaran. Jika hasilnya positif, berarti Anda untung. Jika negatif, berarti rugi.

Contoh sederhana:
Pendapatan bulanan: Rp15.000.000
Biaya bahan baku: Rp6.000.000
Gaji karyawan: Rp3.000.000
Sewa tempat: Rp2.000.000
Biaya lain-lain: Rp1.500.000
Total pengeluaran: Rp12.500.000
Laba bersih: Rp2.500.000

Neraca

Neraca menunjukkan posisi keuangan bisnis Anda pada saat tertentu. Komponennya: aset (apa yang Anda miliki), liabilitas (utang), dan ekuitas (modal sendiri). Prinsip dasarnya: Aset = Liabilitas + Ekuitas.

Laporan Arus Kas

Laporan ini melacak dari mana uang berasal dan ke mana uang pergi. Fokus pada tiga kategori: arus kas operasional (kegiatan bisnis sehari-hari), investasi (pembelian aset), dan pendanaan (pinjaman atau modal).

Dengan memahami ketiga laporan ini, Anda bisa membuat keputusan bisnis yang lebih tepat. Mulailah dengan cara yang sederhana, dan tingkatkan seiring pertumbuhan bisnis Anda.`,
        published: true,
        categoryId: categories[1].id,
        authorId: admin.id,
      },
      {
        title: "Panduan Investasi Modal Kecil untuk Pemula UMKM",
        slug: "panduan-investasi-modal-kecil",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
        excerpt: "Tips berinvestasi dengan modal terbatas bagi pelaku UMKM yang ingin mengembangkan usaha. Mulai dari Rp100 ribu saja sudah bisa berinvestasi.",
        content: `Banyak pelaku UMKM berpikir bahwa investasi hanya untuk orang kaya. Kenyataannya, dengan modal yang kecil sekalipun, Anda sudah bisa memulai investasi. Yang terpenting adalah konsistensi dan pemahaman terhadap instrumen yang dipilih.

Reksadana Pasar Uang

Ini adalah instrumen investasi paling aman untuk pemula. Modal mulai dari Rp100 ribu. Return-nya memang kecil, tapi lebih tinggi dari tabungan biasa. Cocok untuk menempatkan dana darurat yang tidak terpakai.

Tabungan Berjangka

Beberapa bank menawarkan tabungan berjangka dengan bunga yang lebih tinggi dari tabungan biasa. Anda bisa menyetor tetap setiap bulan, misalnya Rp500 ribu selama 12 bulan. Ini membantu Anda disiplin menabung.

Obligasi Ritel (ORI)

Obligasi ritel pemerintah bisa dibeli mulai dari Rp1 juta. Return-nya tetap dan dijamin pemerintah. Cocok untuk Anda yang ingin investasi aman dengan tenor 1-2 tahun.

Saham Blue Chip

Jika Anda ingin return yang lebih besar, coba investasikan sebagian kecil ke saham-saham perusahaan besar. Mulai dari 1 lot (100 lembar) yang bisa berharga Rp500 ribu hingga Rp5 juta tergantung harga sahamnya.

Yang terpenting sebelum berinvestasi: pastikan dana darurat Anda sudah terpenuhi minimal 3 bulan pengeluaran. Jangan sampai investasi justru membuat Anda kesulitan keuangan karena tidak ada cadangan dana.`,
        published: true,
        categoryId: categories[2].id,
        authorId: admin.id,
      },
      {
        title: "Strategi Pembiayaan Usaha Mikro: Dari KUR hingga P2P Lending",
        slug: "strategi-pembiayaan-usaha-mikro",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop",
        excerpt: "Berbagai pilihan pendanaan untuk UMKM dari KUR hingga modal ventura syariah. Pahami kelebihan dan kekurangan masing-masing.",
        content: `Modal adalah salah satu kendala terbesar bagi UMKM yang ingin berkembang. Beruntungnya, kini ada banyak pilihan pembiayaan yang bisa disesuaikan dengan kebutuhan dan kemampuan usaha Anda.

Kredit Usaha Rakyat (KUR)

KUR adalah program pemerintah untuk memberikan pembiayaan kepada UMKM dengan bunga rendah sekitar 6% per tahun. Plafon hingga Rp500 juta. Untuk pinjaman di bawah Rp100 juta, tidak perlu jaminan. Syaratnya: usaha sudah berjalan minimal 6 bulan dan memiliki izin usaha.

Fintech P2P Lending

Platform seperti Investree, Modalku, dan Amartha menawarkan pinjaman berbasis teknologi. Prosesnya cepat, bisa cair dalam hitungan hari. Tapi perhatikan suku bunganya yang biasanya lebih tinggi dari KUR. Cocok untuk kebutuhan mendesak atau modal kerja jangka pendek.

Program Kemitraan BUMN

Beberapa BUMN seperti Pertamina, Telkomsel, dan Indofood memiliki program kemitraan dengan UMKM. Anda bisa mendapatkan modal usaha sekaligus jadi bagian dari rantai pasok mereka. Biasanya menyediakan pelatihan dan jaminan pasar.

Pembiayaan Syariah

Bank syariah menawarkan pembiayaan tanpa bunga dengan prinsip bagi hasil. Akad murabahah (jual beli), musyarakah (kerjasama modal), dan ijarah (sewa) adalah beberapa pilihan yang tersedia. Cocok untuk pelaku usaha yang ingin sesuai prinsip syariah.

Sebelum memutuskan, bandingkan: suku bunga/margin, tenor, syarat jaminan, dan biaya administrasi. Pilih yang paling sesuai dengan cash flow bisnis Anda.`,
        published: true,
        categoryId: categories[3].id,
        authorId: admin.id,
      },
      {
        title: "Prinsip Keuangan Syariah untuk UMKM: Panduan Praktis",
        slug: "prinsip-keuangan-syariah-umkm",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop",
        excerpt: "Memahami konsep bagi hasil, larangan riba, dan akad syariah dalam bisnis sehari-hari. Cocok untuk pelaku UMKM yang ingin menjalankan usaha sesuai prinsip Islam.",
        content: `Keuangan syariah bukan hanya soal agama, tapi juga tentang etika bisnis yang adil dan transparan. Prinsip keuangan syariah menghindari tiga hal utama: riba (bunga), gharar (ketidakpastian berlebihan), dan maisir (spekulasi/judi).

Prinsip Utama Keuangan Syariah

Transaksi harus berdasarkan aset riil, bukan uang semata. Artinya, pembiayaan harus terkait dengan kegiatan bisnis nyata, bukan sekadar pinjam-meminjam uang dengan tambahan bunga.

Bagi hasil harus sesuai kesepakatan (nisbah). Keuntungan dan kerugian dibagi sesuai proporsi yang telah disepakati di awal. Ini sangat berbeda dengan sistem bunga yang selalu menguntungkan pemberi pinjaman.

Jenis Akad Syariah untuk UMKM

Murabahah adalah akad jual beli di mana bank membeli barang yang dibutuhkan dan menjualnya ke Anda dengan margin keuntungan yang disepakati. Cocok untuk pembelian bahan baku atau perlengkapan usaha.

Musyarakah adalah kerjasama modal antara bank dan pelaku usaha. Keuntungan dibagi sesuai proporsi yang disepakati. Cocok untuk usaha yang membutuhkan modal besar untuk ekspansi.

Ijarah adalah akad sewa-menyewa. Bank menyewakan aset kepada Anda, dan di akhir masa sewa, aset tersebut bisa menjadi milik Anda. Cocok untuk pembiayaan kendaraan operasional atau peralatan.

Bank Syariah untuk UMKM

Bank syariah seperti BSI, Bank Muamalat, dan BRI Syariah menyediakan berbagai produk pembiayaan khusus UMKM. Manfaatkan layanan ini untuk mengembangkan usaha sesuai prinsip syariah.`,
        published: true,
        categoryId: categories[4].id,
        authorId: admin.id,
      },
      {
        title: "Tips Mengelola Piutang Usaha agar Tetap Sehat dan Lancar",
        slug: "tips-mengelola-piutang-usaha",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
        excerpt: "Cara efektif mengatur piutang agar arus kas bisnis UMKM tetap lancar. Piutang yang tertagih tepat waktu adalah kunci keberhasilan usaha.",
        content: `Piutang adalah uang yang belum diterima dari pelanggan yang sudah membeli produk atau jasa Anda secara kredit. Meskipun terlihat seperti aset, piutang yang tertunggak bisa menjadi masalah serius bagi arus kas bisnis.

Mengapa Piutang Perlu Dikelola?

Piutang yang menumpuk berarti uang Anda "tertahan" di pelanggan. Anda tetap harus membayar gaji karyawan, membeli bahan baku, dan membayar sewa, meskipun pembayaran dari pelanggan belum datang. Kondisi inilah yang sering menyebabkan UMKM gulung tikar meskipun dari sisi penjualan tampak baik.

Strategi Mengelola Piutang

Pertama, buat kebijakan kredit yang jelas. Tetapkan batas kredit per pelanggan, misalnya maksimal Rp5 juta dengan tempo pembayaran 30 hari. Jangan memberikan kredit tanpa batas kepada pelanggan manapun.

Kedua, berikan insentif untuk pembayaran lebih awal. Misalnya, berikan diskon 2% jika pelanggan membayar dalam 7 hari. Ini akan mempercepat arus kas masuk.

Ketiga, kirim tagihan secara rutin dan profesional. Buatlah format tagihan yang rapi, cantumkan jatuh tempo, dan kirim 3-5 hari sebelum jatuh tempo. Jangan ragu menghubungi pelanggan yang mendekati jatuh tempo.

Keempat, evaluasi piutang setiap bulan. Buat daftar piutang berdasarkan usia: 0-30 hari, 31-60 hari, 61-90 hari, dan lebih dari 90 hari. Semakin tua piutang, semakin sulit ditagih.

Tips Terakhir

Jangan ragu untuk menolak kredit kepada pelanggan yang sudah sering menunggak. Lebih baik kehilangan satu pelanggan daripada arus kas bisnis Anda terganggu.`,
        published: true,
        categoryId: categories[0].id,
        authorId: admin.id,
      },
      {
        title: "Perencanaan Pajak UMKM yang Tepat: Hemat dan Patuh",
        slug: "perencanaan-pajak-umkm",
        image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=400&fit=crop",
        excerpt: "Panduan memahami kewajiban perpajakan untuk usaha mikro, kecil, dan menengah. Kenali jenis pajak dan cara melaporkannya dengan benar.",
        content: `Pajak adalah kewajiban setiap warga negara, termasuk pelaku UMKM. Namun banyak pelaku UMKM yang masih bingung tentang jenis pajak yang harus dibayar dan cara melaporkannya. Berikut panduan lengkapnya.

Jenis Pajak untuk UMKM

PPh Final 0,5% adalah pajak penghasilan final yang dikenakan kepada UMKM dengan omzet hingga Rp4,8 miliar per tahun. Tarifnya hanya 0,5% dari omzet, jauh lebih rendah dari tarif pajak normal. Ini adalah insentif pemerintah untuk mendorong pertumbuhan UMKM.

PPN (Pajak Pertambahan Nilai) dikenakan jika omzet Anda lebih dari Rp4,8 miliar per tahun dan sudah menjadi PKP (Pengusaha Kena Pajak). Tarif PPN adalah 11%.

PPh 21 adalah pajak penghasilan untuk karyawan. Jika Anda memiliki karyawan dengan penghasilan lebih dari Rp4,5 juta per bulan, Anda wajib memotong dan menyetorkan PPh 21.

Tips Perencanaan Pajak

Catat semua pemasukan dan pengeluaran dengan rapi. Ini adalah kunci untuk pelaporan pajak yang benar. Gunakan aplikasi pencatatan keuangan atau buku kas sederhana.

Manfaatkan fasilitas PPh Final 0,5% jika memenuhi syarat. Daftarkan usaha Anda sebagai UMKM di Kantor Pelayanan Pajak terdekat.

Gunakan aplikasi e-Filing untuk lapor pajak online. Sekarang sudah tersedia DJP Online yang memudahkan pelaporan pajak tanpa harus ke kantor pajak.

Siapkan dokumen pendukung seperti faktur, bukti potong, dan laporan keuangan. Simpan minimal 10 tahun untuk keperluan audit.

Konsultasikan dengan konsultan pajak jika merasa bingung. Biaya konsultasi jauh lebih kecil daripada denda keterlambatan atau kesalahan pelaporan.`,
        published: true,
        categoryId: categories[1].id,
        authorId: admin.id,
      },
    ],
  });

  // Forum topics with comments & likes for testing
  const topic1 = await prisma.forumTopic.create({
    data: {
      title: "Bagaimana menaikkan margin keuntungan?",
      content: "Saya ingin tahu strategi agar margin usaha saya lebih sehat tanpa menaikkan harga jual terlalu drastis.",
      category: "Keuangan",
      authorId: umkmUser.id,
    },
  });

  await prisma.forumComment.create({
    data: {
      topicId: topic1.id,
      authorId: consultantUser.id,
      content: "Fokus pada pengurangan biaya variabel dan kelola stok lebih baik. Coba evaluasi supplier mana yang bisa memberikan harga lebih kompetitif.",
    },
  });

  await prisma.forumComment.create({
    data: {
      topicId: topic1.id,
      authorId: sariUser.id,
      content: "Saya juga dulu mengalami hal serupa. Yang membantu saya adalah menaikkan sedikit harga di produk premium sambil tetap menjaga produk entry-level.",
    },
  });

  await prisma.forumLike.createMany({
    data: [
      { topicId: topic1.id, userId: admin.id },
      { topicId: topic1.id, userId: sariUser.id },
      { topicId: topic1.id, userId: rudiUser.id },
    ],
  });

  const topic2 = await prisma.forumTopic.create({
    data: {
      title: "Rekomendasi aplikasi catatan keuangan untuk UMKM",
      content: "Selama ini saya masih pakai Excel, ada rekomendasi aplikasi yang lebih praktis untuk catatan keuangan harian? Gratis atau berbayar yang penting mudah digunakan.",
      category: "Teknologi",
      authorId: sariUser.id,
    },
  });

  await prisma.forumComment.create({
    data: {
      topicId: topic2.id,
      authorId: umkmUser.id,
      content: "Saya pakai BukuKas, gratisfree dan cukup mudah. Bisa catat pemasukan/pengeluaran harian dan ada laporan otomatis.",
    },
  });

  await prisma.forumComment.create({
    data: {
      topicId: topic2.id,
      authorId: admin.id,
      content: "Bisa juga coba aplikasi Jurnal atau Moka, tapi untuk UMKM skala kecil BukuKas atau Catatan Keuangan sudah cukup.",
    },
  });

  await prisma.forumLike.createMany({
    data: [
      { topicId: topic2.id, userId: umkmUser.id },
      { topicId: topic2.id, userId: rudiUser.id },
    ],
  });

  const topic3 = await prisma.forumTopic.create({
    data: {
      title: "Cara mendapatkan modal usaha tanpa agunan",
      content: "Usaha saya sudah berjalan 2 tahun tapi terkendala modal untuk ekspansi. Adakah program pemerintah atau fintech yang memberikan pinjaman tanpa agunan untuk UMKM?",
      category: "Pembiayaan",
      authorId: rudiUser.id,
    },
  });

  await prisma.forumComment.create({
    data: {
      topicId: topic3.id,
      authorId: consultantUser.id,
      content: "KUR (Kredit Usaha Rakyat) bisa jadi pilihan. Plafon sampai Rp500 juta tanpa agunan untuk pinjaman sampai Rp100 juta. Bunganya juga rendah sekitar 6% per tahun.",
    },
  });

  await prisma.forumComment.create({
    data: {
      topicId: topic3.id,
      authorId: umkmUser.id,
      content: "Saya pernah pakai KUR BRI, prosesnya cukup mudah. Syaratnya usaha sudah berjalan minimal 6 bulan dan punya izin usaha.",
    },
  });

  await prisma.forumLike.createMany({
    data: [
      { topicId: topic3.id, userId: admin.id },
      { topicId: topic3.id, userId: sariUser.id },
    ],
  });

  await prisma.template.createMany({
    data: [
      { title: "Template Laba Rugi", description: "Format Excel untuk laporan laba rugi usaha.", filePath: "/templates/laba-rugi.xlsx", category: "Laporan Keuangan" },
      { title: "Template Arus Kas", description: "Template arus kas operasional UMKM.", filePath: "/templates/arus-kas.xlsx", category: "Cash Flow" },
    ],
  });

  await prisma.consultation.create({
    data: {
      userId: umkmUser.id,
      consultantId: consultantUser.consultant.id,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "CONFIRMED",
      notes: { create: [{ content: "Tinjau laporan bulan lalu dan siapkan pertanyaan pengelolaan kas." }] },
    },
  });

  console.log("Seed data berhasil dibuat.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
