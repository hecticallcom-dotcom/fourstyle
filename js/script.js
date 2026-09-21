<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up | Fourstyle</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      overflow-x: hidden; overflow-y: auto;
      position: relative;
    }
    body::before {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%);
      top: -150px;
      left: -150px;
      animation: float 9s ease-in-out infinite;
    }
    body::after {
      content: '';
      position: absolute;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(201,162,39,0.1) 0%, transparent 70%);
      bottom: -80px;
      right: -80px;
      animation: float 11s ease-in-out infinite reverse;
    }
    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-20px, 25px); }
    }
    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
      padding: 20px;
    }
    .auth-card {
      background: rgba(255,255,255,0.97);
      border-radius: 20px;
      padding: 40px 35px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.4);
      animation: slideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .auth-logo {
      text-align: center;
      margin-bottom: 25px;
    }
    .auth-logo img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #c9a227;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,39,0.4); }
      50% { box-shadow: 0 0 0 12px rgba(201,162,39,0); }
    }
    .auth-logo h1 {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      color: #1a1a1a;
      margin-top: 12px;
    }
    .auth-logo p {
      color: #888;
      font-size: 13px;
      margin-top: 4px;
    }
    .form-group {
      margin-bottom: 16px;
      position: relative;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #555;
      margin-bottom: 6px;
    }
    .form-group input {
      width: 100%;
      padding: 13px 16px 13px 42px;
      border: 2px solid #eee;
      border-radius: 10px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      transition: all 0.3s;
      outline: none;
      background: #fafafa;
    }
    .form-group input:focus {
      border-color: #c9a227;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(201,162,39,0.12);
    }
    .form-group i {
      position: absolute;
      left: 14px;
      top: 38px;
      color: #aaa;
      font-size: 15px;
    }
    .form-group input:focus ~ i { color: #c9a227; }
    .auth-btn-submit {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #1a1a1a, #333);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 8px;
    }
    .auth-btn-submit:hover {
      background: linear-gradient(135deg, #c9a227, #e0b83a);
      color: #1a1a1a;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(201,162,39,0.35);
    }
    .auth-links {
      text-align: center;
      margin-top: 22px;
      font-size: 13px;
      color: #666;
    }
    .auth-links a {
      color: #c9a227;
      font-weight: 600;
      text-decoration: none;
    }
    .auth-links a:hover { color: #1a1a1a; }
    .back-home {
      display: block;
      text-align: center;
      margin-top: 18px;
      color: #999;
      font-size: 13px;
      text-decoration: none;
    }
    .back-home:hover { color: #c9a227; }
    .error-msg, .success-msg {
      padding: 10px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 15px;
      display: none;
    }
    .error-msg { background: #fee; color: #c00; animation: shake 0.4s; }
    .success-msg { background: #efe; color: #080; }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }

    @media (max-width: 900px) {
      body { overflow-x: hidden; overflow-y: auto !important; }
      body::before, body::after { display: none; }
      .auth-container { padding: 16px; max-width: 100%; }
      .auth-card { padding: 28px 22px; border-radius: 16px; max-width: 100%; }
      .auth-logo h1 { font-size: 22px; }
      .auth-logo img { width: 60px; height: 60px; }
      .form-group input { font-size: 16px; /* prevent iOS zoom */ }
    }
    @media (max-width: 480px) {
      .auth-card { padding: 22px 16px; }
      .auth-logo h1 { font-size: 20px; }
      .auth-btn-submit { padding: 12px; font-size: 14px; }
    }
    @media (min-width: 901px) {
      .auth-container { max-width: 440px; }
      .auth-card { padding: 40px 36px; }
    }
  </style>
</head>
<body>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="images/logo.jpeg" alt="Fourstyle">
        <h1>Create Account</h1>
        <p>Join Fourstyle family today</p>
      </div>

      <div class="error-msg" id="errorMsg"></div>
      <div class="success-msg" id="successMsg"></div>

      <form id="signupForm">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="name" placeholder="Your full name" required>
          <i class="fas fa-user"></i>
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="email" placeholder="you@example.com" required>
          <i class="fas fa-envelope"></i>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password" placeholder="Min 6 characters" required minlength="6">
          <i class="fas fa-lock"></i>
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" id="confirmPassword" placeholder="Repeat password" required>
          <i class="fas fa-lock"></i>
        </div>
        <button type="submit" class="auth-btn-submit">
          <i class="fas fa-user-plus"></i> Sign Up
        </button>
      </form>

      <div class="auth-links">
        Already have an account? <a href="login.html">Login</a>
      </div>
      <a href="index.html" class="back-home"><i class="fas fa-arrow-left"></i> Back to Shop</a>
    </div>
  </div>

  <script>
    document.getElementById('signupForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;
      const errorMsg = document.getElementById('errorMsg');
      const successMsg = document.getElementById('successMsg');

      errorMsg.style.display = 'none';
      successMsg.style.display = 'none';

      if (password !== confirm) {
        errorMsg.textContent = '❌ Passwords do not match.';
        errorMsg.style.display = 'block';
        return;
      }

      if (password.length < 6) {
        errorMsg.textContent = '❌ Password must be at least 6 characters.';
        errorMsg.style.display = 'block';
        return;
      }

      const users = JSON.parse(localStorage.getItem('fourstyle_users') || '[]');
      if (users.find(u => u.email === email)) {
        errorMsg.textContent = '❌ Email already registered. Please login.';
        errorMsg.style.display = 'block';
        return;
      }

      users.push({ name, email, password, role: 'user' });
      localStorage.setItem('fourstyle_users', JSON.stringify(users));

      // Track registration in Firebase
      try {
        if (typeof firebase !== 'undefined' && firebase.database) {
          firebase.database().ref('stats/registrations').push({
            name, email,
            time: new Date().toLocaleString('en-PK'),
            timestamp: Date.now()
          });
          firebase.database().ref('stats/registerCount').transaction(c => (c || 0) + 1);
        }
      } catch (err) {}

      successMsg.textContent = '✅ Account created! Redirecting to login...';
      successMsg.style.display = 'block';

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    });
  </script>
  <script src="https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.0/firebase-database-compat.js"></script>
  <script src="js/firebase-config.js"></script>
</body>
</html>
