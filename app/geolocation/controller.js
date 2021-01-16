import csv from 'csvtojson';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getProvinces = async (req, res, next) => {
    const db = path.resolve(__dirname, './data/provinces.csv');
    try {
        const data = await csv().fromFile(db);
        return res.json(data);
    } catch (err) {
        return res.status(500).json({
            message: err.message, 
            fields: null
        }); 
    }
}

export const getRegencies = async (req, res, next) => {
    const db = path.resolve(__dirname, './data/regencies.csv');
    try {
        let { id_province } = req.query;
        const data = await csv().fromFile(db);
        if (!id_province) return res.json(data);
        return res.json(data.filter(regency => regency.kode_provinsi === id_province));
    } catch (err) {
        return res.status(500).json({
            message: err.message, 
            fields: null
        }); 
    }
}

export const getDistricts = async (req, res, next) => {
    const db = path.resolve(__dirname, './data/districts.csv');
    try {
        let { id_regency } = req.query;
        const data = await csv().fromFile(db);
        if (!id_regency) return res.json(data);
        return res.json(data.filter(district => district.kode_kabupaten === id_regency));
    } catch (err) {
        return res.status(500).json({
            message: err.message, 
            fields: null
        }); 
    }
}

export const getVillages = async (req, res, next) => {
    const db = path.resolve(__dirname, './data/villages.csv');
    try {
        let { id_district } = req.query;
        const data = await csv().fromFile(db);
        if (!id_district) return res.json(data);
        return res.json(data.filter(village => village.kode_kecamatan === id_district));
    } catch (err) {
        return res.status(500).json({
            message: err.message, 
            fields: null
        }); 
    }
}