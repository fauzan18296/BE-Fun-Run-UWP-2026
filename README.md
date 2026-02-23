# 👨‍💻 BE-🏃‍➡️-Fun-Run-UWP-2026
UWP Fun Run is a platform for registering for running events organized by one of the campuses in Surabaya, namely Wijaya Putra University.
> 📓 **Note:** This repository is part of the **back-end** source code project. For the [**front-end**](https://github.com/fauzan18296/FE-Fun-Run-UWP-2026.git) source code, please see my other repository.
---
## 📖 Overview
**Fun Run UWP** is a running event registration platform at Wijaya Putra University, aimed at promoting an active and healthy lifestyle among the community. The event is more than just a casual gathering, but an experience that combines exercise, camaraderie, and a healthy competitive spirit. The project aims to make it easier for local residents and UWP students to register for running events using the platform's built-in features.

---

## ✨ Features
- Input data form for registration event.
- Login admin for survey the participants.
- Payment integration on event registration form.
- Export button to save data in Excel format.

---

## 🛠️ Tech Stack

**Front end**
- ReactJS
- TailwindCss

**Back end**
- NodeJs
- ExpressJs
- Mysql

**Others**
- Midtrans
- Feather Icons

---

## 📁 Project Structure
```text
📦backend
 ┣ 📂src
 ┃ ┗ 📜main.js
 ┣ 📜.env
 ┣ 📜.env.sample
 ┣ 📜.gitignore
 ┣ 📜README.md
 ┣ 📜bun.lock
 ┗ 📜package.json
```

---

## ⚙️ Installation & 📐 Setup
1. Clone repository

1.1 Clone repository with ssh method
```bash
git clone git@github.com:fauzan18296/BE-Fun-Run-UWP-2026.git
```

1.2 Clone repository with web url method

```bash
git clone https://github.com/fauzan18296/BE-Fun-Run-UWP-2026.git
```

2. Install dependecies and package manager

2.1 Install package manager
```bash
npm install -g bun
```

2.2 Install depedencies
```bash
bun install
```
📍If you run `bun install`, it will create a directory named `node_modules/`

3. Setup environment  

```bash
cp .env.sample .env
```

>📓 **Note:** You need setup **env(environment)** for configure applications by securely storing, environment, and sensitive information.

4. Run project
```bash
bun start
```
📍This will run the back-end project in the **Fun-Run-UWP** directory.

---

## 🔐 Configuration
This is very important because **configuration** relates to **env(environment)**, this **configuration** contains among others:
- **PORT**
- **USERNAME DATABASE**
- **HOSTNAME DATABASE**
- **PASSWORD DATABASE**
- **DATABASE NAME**
- **MIDTRANS CLIEN KEY**
- **MIDTRANS SERVER KEY**
- etc.

Example:

```
PORT=4000
MIDTRANS_CLIENT_KEY="YOUR_CLIENT_SERVER" # ? This client key from midtrans payment gateway in production status or sandbox status
MIDTRANS_SERVER_KEY="YOUR_SERVER_KEY" # ? This server key from midtrans payment gateway  in production status or sandbox status
```