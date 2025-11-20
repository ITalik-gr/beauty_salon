import * as usersService from "../services/users.service.js";

export async function getUsers(req, res) {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function createUser(req, res) {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getMe(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Необхідна авторизація" });
    }

    const user = await usersService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// /api/users/me (PATCH)
export async function updateMe(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Необхідна авторизація" });
    }

    const { email, name, lastName } = req.body;

    const updated = await usersService.updateUserProfile(userId, {
      email,
      name,
      lastName,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error in updateMe:", err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
}

// /api/users/me/password (PATCH)
export async function changePassword(req, res) {
  try {
    const userId = req.user?.id;
    console.log(req.boy);
    
    if (!userId) {
      return res.status(401).json({ message: "Необхідна авторизація" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Поточний і новий пароль є обов'язковими",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Новий пароль має бути не менше 6 символів",
      });
    }

    await usersService.updateUserPassword(
      userId,
      currentPassword,
      newPassword
    );

    res.json({ message: "Пароль успішно змінено" });
  } catch (err) {
    console.error("Error in changePassword:", err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
}