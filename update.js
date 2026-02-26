const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = 'e:/Tour web';
const imagesDir = path.join(dir, 'images');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Download helper
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(imagesDir, filename);
        if (fs.existsSync(filepath)) return resolve();

        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to download ${filename}, status: ${res.statusCode}`));
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => reject(err));
        });
    });
}

const imagesToDownload = {
    'hero-bg.jpg': 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80',
    'auth-bg.jpg': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80',
    'page-header.jpg': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80',
    'about.jpg': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    'dest1.jpg': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    'dest2.jpg': 'https://images.unsplash.com/photo-1542314831-c6a4d14edfa5?auto=format&fit=crop&w=800&q=80',
    'dest3.jpg': 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    'dest4.jpg': 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80',
    'dest5.jpg': 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80',
    'dest6.jpg': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
};

async function main() {
    console.log("Downloading images...");
    for (const [filename, url] of Object.entries(imagesToDownload)) {
        console.log(`Downloading ${filename}...`);
        await downloadImage(url, filename).catch(e => console.error("Error downloading", filename, e.message));
    }
    console.log("Image downloads finished.");

    const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

    for (const file of htmlFiles) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Replace YOUR_WEBSITE_NAME
        content = content.replace(/YOUR_WEBSITE_NAME/g, "WanderWave");

        // Update unspalsh urls to local
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-15107988[^\s"'>]+/g, "images/dest1.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-15423148[^\s"'>]+/g, "images/dest2.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-14997939[^\s"'>]+/g, "images/dest3.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-14498449[^\s"'>]+/g, "images/dest4.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-15427186[^\s"'>]+/g, "images/dest5.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-14648227[^\s"'>]+/g, "images/dest6.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-14698545[^\s"'>]+/g, "images/about.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-14477528[^\s"'>]+/g, "images/hero-bg.jpg");
        content = content.replace(/https:\/\/images\.unsplash\.com\/photo-14765145[^\s"'>]+/g, "images/page-header.jpg");

        // Add img-fluid where needed - typically replacing 'img src=' outside of card-img-top if missing
        // since I use 'card-img-top' and 'img-fluid', it's already structured well. Let's make sure logo isn't broken.
        content = content.replace(/images\/logo\.png[^>]+onerror=[^>]+>/g, 'images/logo.jpg" alt="Logo" class="img-fluid" style="height:40px;">');
        // Let's just fix the logo. The user provided logo.png but in their folder I listed logo.jpg before. Wait, I remember list_dir returned `logo.jpg`. Let me check later.

        // Navbar Update - Pill shape
        const isAuthPage = file === 'login.html' || file === 'signup.html';

        // Use active class replacement
        let homeActive = file === 'index.html' ? 'active' : '';
        let staysActive = file === 'destinations.html' ? 'active' : '';
        let aboutActive = file === 'about.html' ? 'active' : '';
        let galleryActive = file === 'gallery.html' ? 'active' : '';
        let contactActive = file === 'contact.html' ? 'active' : '';
        let packagesActive = file === 'packages.html' ? 'active' : ''; // optional if we keep it

        let newNav = `<!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom fixed-top">
        <div class="container mt-3 pb-0">
            <div class="navbar-pill w-100 d-flex justify-content-between align-items-center position-relative z-3">
                <!-- Brand -->
                <a class="navbar-brand d-flex align-items-center m-0 me-lg-4" href="index.html">
                    <span class="text-white fw-bold fs-4">WanderWave</span>
                </a>
                
                <!-- Toggle Button for Mobile -->
                <button class="navbar-toggler border-0 shadow-none text-white d-lg-none p-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <i class="fas fa-bars fs-4"></i>
                </button>
                
                <!-- Links -->
                <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul class="navbar-nav mx-auto align-items-center gap-2 gap-lg-4 my-2 my-lg-0">
                        <li class="nav-item ${homeActive}"><a class="nav-link text-white text-opacity-75 position-relative hover-white" href="index.html">Home</a></li>
                        <li class="nav-item ${staysActive}"><a class="nav-link text-white text-opacity-75 position-relative hover-white" href="destinations.html">Stays</a></li>
                        <li class="nav-item ${aboutActive}"><a class="nav-link text-white text-opacity-75 position-relative hover-white" href="about.html">About</a></li>
                        <li class="nav-item ${packagesActive}"><a class="nav-link text-white text-opacity-75 position-relative hover-white" href="packages.html">Packages</a></li>
                        <li class="nav-item ${contactActive}"><a class="nav-link text-white text-opacity-75 position-relative hover-white" href="contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <!-- Right Side Item -->
                <div class="d-none d-lg-flex align-items-center ms-auto">
                    <span class="text-white text-decoration-none d-flex align-items-center fs-6 me-3">
                        EN <i class="fas fa-map-marker-alt ms-2"></i>
                    </span>
                    <a href="login.html" class="text-white nav-link p-0 hover-white"><i class="far fa-user"></i></a>
                </div>
            </div>
        </div>
    </nav>`;

        if (isAuthPage) {
            newNav = `<!-- Absolute Navbar for Auth Pages -->
    <nav class="navbar navbar-expand-lg navbar-custom position-absolute w-100 top-0">
        <div class="container mt-3">
            <div class="navbar-pill w-100 d-flex justify-content-between align-items-center">
                <a class="navbar-brand m-0" href="index.html">
                    <span class="text-white fw-bold fs-4">WanderWave</span>
                </a>
                <a href="index.html" class="text-white nav-link hover-white"><i class="fas fa-arrow-left me-2"></i>Back</a>
            </div>
        </div>
    </nav>`;
            if (content.match(/<!-- Absolute Navbar for Auth Pages -->[\s\S]*?<\/nav>/)) {
                content = content.replace(/<!-- Absolute Navbar for Auth Pages -->[\s\S]*?<\/nav>/, newNav);
            }
        } else {
            if (content.match(/<!-- Navbar -->[\s\S]*?<\/nav>/)) {
                content = content.replace(/<!-- Navbar -->[\s\S]*?<\/nav>/, newNav);
            }
        }

        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Processed ${file}`);
    }

    // Process CSS
    let cssPath = path.join(dir, 'css', 'style.css');
    let cssContent = fs.readFileSync(cssPath, 'utf8');

    // Replace unsplash urls
    cssContent = cssContent.replace(/url\(['"]?https:\/\/images\.unsplash\.com\/photo-14477528[^\s"'\)]+['"]?\)/g, "url('../images/hero-bg.jpg')");
    cssContent = cssContent.replace(/url\(['"]?https:\/\/images\.unsplash\.com\/photo-15017858[^\s"'\)]+['"]?\)/g, "url('../images/auth-bg.jpg')");
    cssContent = cssContent.replace(/url\(['"]?https:\/\/images\.unsplash\.com\/photo-14765145[^\s"'\)]+['"]?\)/g, "url('../images/page-header.jpg')");

    // Replace navbar-custom styles
    const navStyleReplacement = `
/* Navbar Pill Style */
.navbar-custom {
    background: transparent !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    padding-top: 20px;
    padding-bottom: 20px;
    transition: all 0.3s ease;
}

.navbar-pill {
    background-color: rgba(13, 25, 15, 0.9); /* Dark green/black pill matching image */
    backdrop-filter: blur(10px);
    border-radius: 50px;
    padding: 12px 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.navbar-custom.navbar-scrolled {
    padding-top: 10px;
    background-color: transparent;
}

.navbar-custom.navbar-scrolled .navbar-pill {
    background-color: rgba(13, 25, 15, 0.98);
}

.nav-link {
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link.hover-white:hover, .nav-item.active .hover-white {
    color: white !important;
    opacity: 1 !important;
}

.nav-link::after {
    display: none; /* remove bottom accent underline for pill style */
}

/* Auth Cards */
`;
    if (cssContent.match(/\/\* Navbar \*\/[\s\S]*?\/\* Buttons \*\//)) {
        cssContent = cssContent.replace(/\/\* Navbar \*\/[\s\S]*?\/\* Buttons \*\//, `/* Navbar */\n${navStyleReplacement}\n/* Buttons */`);
    }

    fs.writeFileSync(cssPath, cssContent, 'utf8');
    console.log("Processed style.css");
}

main().catch(console.error);
