import * as mastersService from "../services/masters.service.js";

export async function getMastersPublic(req, res) {
  try {
    const masters = await mastersService.getPublicMasters();
    res.json(masters);
  } catch (err) {
    console.error("Error getMastersPublic:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getMasterPublic(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID майстра" });
    }

    const master = await mastersService.getPublicMasterById(id);
    if (!master) {
      return res.status(404).json({ message: "Майстра не знайдено" });
    }

    res.json(master);
  } catch (err) {
    console.error("Error getMasterPublic:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ADmin

export async function getMastersAdmin(req, res) {
  try {
    const masters = await mastersService.getAllMastersAdmin();
    res.json(masters);
  } catch (err) {
    console.error("Error getMastersAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createMaster(req, res) {
  try {
    const { name, lastName, speciality } = req.body;

    if (!name || !lastName) {
      return res
        .status(400)
        .json({ message: "Імʼя та прізвище майстра є обовʼязковими" });
    }

    const master = await mastersService.createMaster({
      name,
      lastName,
      speciality,
    });

    res.status(201).json(master);
  } catch (err) {
    console.error("Error createMaster:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateMaster(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID майстра" });
    }

    const { name, lastName, speciality, isActive } = req.body;

    const master = await mastersService.updateMaster(id, {
      name,
      lastName,
      speciality,
      isActive,
    });

    res.json(master);
  } catch (err) {
    console.error("Error updateMaster:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deactivateMasterController(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID майстра" });
    }

    const master = await mastersService.deactivateMaster(id);
    res.json({ message: "Майстра деактивовано", master });
  } catch (err) {
    console.error("Error deactivateMaster:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Задати які послуги робить майстер
export async function setMasterServicesController(req, res) {
  try {
    const masterId = Number(req.params.id);
    if (Number.isNaN(masterId)) {
      return res.status(400).json({ message: "Некоректний ID майстра" });
    }

    const { serviceIds } = req.body;

    if (!Array.isArray(serviceIds)) {
      return res
        .status(400)
        .json({ message: "serviceIds має бути масивом ID послуг" });
    }

    const normalizedIds = serviceIds
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    const master = await mastersService.setMasterServices(
      masterId,
      normalizedIds
    );

    res.json(master);
  } catch (err) {
    console.error("Error setMasterServices:", err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
}