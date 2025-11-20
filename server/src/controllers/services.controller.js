import * as servicesService from "../services/services.service.js";

export async function getServicesPublic(req, res) {
  try {
    const services = await servicesService.getPublicServices();
    res.json(services);
  } catch (err) {
    console.error("Error getServicesPublic:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getServicePublic(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID послуги" });
    }

    const service = await servicesService.getPublicServiceById(id);
    if (!service) {
      return res.status(404).json({ message: "Послугу не знайдено" });
    }

    res.json(service);
  } catch (err) {
    console.error("Error getServicePublic:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ADMIN

export async function getServicesAdmin(req, res) {
  try {
    const services = await servicesService.getAllServicesAdmin();
    res.json(services);
  } catch (err) {
    console.error("Error getServicesAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createService(req, res) {
  try {
    const {
      name,
      description,
      price,
      durationMin,
      categoryId,
      imageUrl,       
    } = req.body;

    if (!name || price === undefined) {
      return res
        .status(400)
        .json({ message: "Назва і ціна послуги є обов'язковими" });
    }

    const priceNumber = Number(price);
    const durationNumber = durationMin ? Number(durationMin) : undefined;

    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      return res
        .status(400)
        .json({ message: "Некоректна ціна послуги" });
    }

    const service = await servicesService.createService({
      name,
      description,
      price: priceNumber,
      durationMin: durationNumber,
      categoryId,
      imageUrl,
    });

    res.status(201).json(service);
  } catch (err) {
    console.error("Error createService:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateService(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID послуги" });
    }

    const {
      name,
      description,
      price,
      durationMin,
      isActive,
      categoryId,
      imageUrl,
    } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) {
      const priceNumber = Number(price);
      if (Number.isNaN(priceNumber) || priceNumber <= 0) {
        return res
          .status(400)
          .json({ message: "Некоректна ціна послуги" });
      }
      data.price = priceNumber;
    }
    if (durationMin !== undefined) {
      const durationNumber = Number(durationMin);
      if (Number.isNaN(durationNumber) || durationNumber <= 0) {
        return res
          .status(400)
          .json({ message: "Некоректна тривалість послуги" });
      }
      data.durationMin = durationNumber;
    }
    if (isActive !== undefined) {
      data.isActive = Boolean(isActive);
    }
    if (categoryId !== undefined) {
      data.categoryId = categoryId;
    }
    if (imageUrl !== undefined) {
      data.imageUrl = imageUrl; 
    }

    const service = await servicesService.updateService(id, data);
    res.json(service);
  } catch (err) {
    console.error("Error updateService:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deactivateServiceController(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Некоректний ID послуги" });
    }

    const service = await servicesService.deactivateService(id);
    res.json({ message: "Послугу деактивовано", service });
  } catch (err) {
    console.error("Error deactivateService:", err);
    res.status(500).json({ message: "Server error" });
  }
}