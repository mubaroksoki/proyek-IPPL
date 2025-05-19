const Parfum = require("../models/Parfum");
const Boom = require("@hapi/boom");

class KatalogController {
  static async getAllParfums(request, h) {
    try {
      const parfums = await Parfum.getAll();
      return {
        status: "success",
        data: {
          parfums,
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async getParfumDetail(request, h) {
    try {
      const { parfumId } = request.params;
      const parfum = await Parfum.getById(parfumId);

      if (!parfum) {
        return Boom.notFound("Parfum not found");
      }

      // Track view interaction if user is authenticated
      if (request.auth.isAuthenticated) {
        await Parfum.trackInteraction(
          request.auth.credentials.user_id,
          parfumId,
          "view"
        );
      }

      return {
        status: "success",
        data: {
          parfum,
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async searchParfums(request, h) {
    try {
      const { keyword } = request.query;
      const parfums = await Parfum.search(keyword);

      return {
        status: "success",
        data: {
          parfums,
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async filterParfums(request, h) {
    try {
      const { brand, gender, sort } = request.query;
      let parfums;

      if (brand) {
        parfums = await Parfum.filterByBrand(brand);
      } else if (gender) {
        parfums = await Parfum.filterByGender(gender);
      } else if (sort === "name") {
        parfums = await Parfum.sortByName();
      } else if (sort === "price") {
        parfums = await Parfum.sortByPrice();
      } else {
        parfums = await Parfum.getAll();
      }

      return {
        status: "success",
        data: {
          parfums,
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }
}

module.exports = KatalogController;
