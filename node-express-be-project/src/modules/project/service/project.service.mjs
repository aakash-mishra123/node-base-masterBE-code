import { Op } from 'sequelize';
import _ from 'lodash';
import { Chapter, Module, Project, ProjectModule, Section, SectionField, SectionFieldOption, SectionFieldValue } from '../../index.model.mjs';
import { AppError } from '../../../utils/errorHandler.mjs';
import { excludeFields, parseBoolean } from '../../../utils/handler.utils.mjs';
import { createObjectCsvWriter } from 'csv-writer';
import csvParser from 'csv-parser';
import PDFDocument from 'pdfkit';
import ExcelJs from 'exceljs';
import JSZip from 'jszip'

import path from 'path';
import fs from 'fs';
import { tempStorageDir } from '../../../config/index.mjs';
import { CSV_HEADER_KEYS, CSV_HEADERS, KEY_RATIO_CSV_HEADERS, KEY_RATIO_INPUT_HEADERS } from '../metadata/project.metadata.mjs';
import { ProjectModuleService } from '../../projectModule/service/projectModule.service.mjs'
import { KeyRatioFieldService } from '../../keyRatioFields/service/keyRatioFields.service.mjs';
import { ChapterService } from '../../chapter/service/chapter.service.mjs';
import { sequelize } from '../../../db/connection.mjs';

export class ProjectService {

    constructor() {
        this.projectModuleService = new ProjectModuleService();
        this.keyRatioFieldService = new KeyRatioFieldService();
        this.chapterService = new ChapterService();
    }
    async createProject(data, userId) {
        const transaction = await sequelize.transaction();

        try {
            const project = await Project.create({ ...data, userId }, { transaction });

            const modules = await Module.findAll({
                where: { type: data.projectType },
                transaction
            });

            if (!modules.length) {
                throw new AppError('NOT_FOUND', 404, 'No modules found for the selected category');
            }

            const projectModulesPayload = modules.map((mod, index) => ({
                projectId: project.id,
                userId,
                moduleId: mod.id,
                allParams: mod.parameters || 0,
                completedChapters: 0,
                moduleStatus: 0,
                deviations: 0,
                benchmarkParams: 0,
                flags: 0,
                complianceScore: 0,
                status: index === 0 ? 'active' : 'pending'
            }));

            await ProjectModule.bulkCreate(projectModulesPayload, { transaction });

            await transaction.commit();
            return excludeFields(project);
        }
        catch (error) {
            throw error;
        }
    }

    async getProjectById(projectId) {
        try {
            const project = await Project.findOne({
                where: { id: projectId, isDeleted: 0 },
            });

            if (!project) {
                throw new AppError('NOT_FOUND', 404, 'Project not found');
            }

            return excludeFields(project);
        }
        catch (error) {
            throw error;
        }
    }

    async getAllProjects(queryParams, userId) {
        try {
            const {
                page = 1,
                limit = 10,
                fromDate,
                toDate,
                projectType,
                projectCategory,
                search,
            } = queryParams;

            const parsedPage = Number.isNaN(parseInt(page)) || parseInt(page) <= 0 ? 1 : parseInt(page);
            const parsedLimit = Number.isNaN(parseInt(limit)) || parseInt(limit) <= 0 ? 10 : parseInt(limit);
            const offset = (parsedPage - 1) * parsedLimit;

            let whereClause = { userId, isDeleted: 0 };

            if (fromDate && toDate) {
                const start = new Date(fromDate);
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                whereClause.created_at = { [Op.between]: [start, end] };
            }
            else if (fromDate) {
                whereClause.created_at = { [Op.gte]: new Date(fromDate) };
            }
            else if (toDate) {
                whereClause.created_at = { [Op.lte]: new Date(toDate) };
            }

            if (projectType) whereClause.projectType = projectType;
            if (projectCategory) whereClause.category = projectCategory;
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { category: { [Op.like]: `%${search}%` } },
                ];
            }

            const { count, rows } = await Project.findAndCountAll({
                where: whereClause,
                offset,
                limit: parsedLimit,
                order: [['created_at', 'ASC']],
                attributes: { exclude: ['createdAt', 'updatedAt', 'isDeleted'] },
            });

            return {
                count,
                totalPages: Math.ceil(count / parsedLimit),
                currentPage: parsedPage,
                rows,
            };
        }
        catch (error) {
            throw error;
        }
    }


    //create a save api for a project id
    async saveProjectModule(userId, projectId, data) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new AppError('NOT_FOUND', 404, 'Project not found');
        }
        const { moduleId, completedChapters } = data;

        const newMid = parseInt(moduleId)
        const newComChap = parseInt(completedChapters)
        const newPid = parseInt(projectId)

        // Save project module details
        await this.projectModuleService.saveProjectModule(userId, newPid, newMid, newComChap);

        return "Project updated successfully";
    }

    //create a save api for a project id
    async saveProject(projectId, data) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new AppError('NOT_FOUND', 404, 'Project not found');
        }

        await project.update(data);

        return "Project updated successfully";
    }


    async deleteProject(projectId) {

        await Project.update(
            { isDeleted: 1 },
            {
                where: { id: projectId, isDeleted: 0 }
            }
        );

        return "Project deleted successfully";
    }

    async exportProjectInCSV(formattedData, filePath) {
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: CSV_HEADERS
        });
        return await csvWriter.writeRecords(formattedData);
    }

    // async exportProjectInPDF(formattedData, filePath, title = "Project name") {

    //     const doc = new PDFDocument();
    //     doc.pipe(fs.createWriteStream(filePath));

    //     doc.fontSize(16).text(`Project Report - ${title}`, { align: 'center' });
    //     doc.moveDown();

    //     formattedData.forEach((row, index) => {
    //         doc.fontSize(10).text(`Module: ${row.ModuleName} - Chapter: ${row.ChapterTitle}`);
    //         doc.text(`Section: ${row.SectionTitle} - Field: ${row.FieldName} (${row.FieldType})`);
    //         doc.text(`Answer: ${row.Answer || 'N/A'} - Remark: ${row.Remark || 'N/A'} - IsFlaged: ${row.IsFlaged}`);
    //         doc.moveDown(0.5);
    //         if (index % 5 === 0) doc.addPage();
    //     });

    //     doc.end();
    //     return
    // }


    // async importProject(userId, projectId, moduleId, filePath) {

    //     return new Promise((resolve, reject) => {
    //         const results = [];
    //         let isHeaderValidated = false;

    //         fs.createReadStream(filePath)
    //             .pipe(csvParser())
    //             .on('headers', (headers) => {
    //                 const missingHeaders = CSV_HEADER_KEYS.filter(h => !headers.includes(h));

    //                 if (missingHeaders.length > 0) {
    //                     fs.unlinkSync(filePath);
    //                     return reject(new AppError('BAD_REQUEST', 400, `Invalid CSV format. Missing headers: ${missingHeaders.join(', ')}`));
    //                 }
    //                 isHeaderValidated = true;
    //             })
    //             .on('data', (row) => {
    //                 if (!isHeaderValidated) return;

    //                 // Only process rows for the specified moduleId
    //                 if (row.ModuleID === moduleId) {
    //                     results.push({
    //                         moduleId: row.ModuleID,
    //                         moduleName: row.ModuleName,
    //                         chapterId: row.ChapterID,
    //                         chapterTitle: row.ChapterTitle,
    //                         sectionId: row.SectionID,
    //                         sectionTitle: row.SectionTitle,
    //                         fieldId: row.FieldID,
    //                         fieldName: row.FieldName,
    //                         fieldType: row.FieldType,
    //                         midEndAns: row.MidEndAns || '',
    //                         affluentAns: row.AffluentAns || '',
    //                         premiumAns: row.PremiumAns || '',
    //                         fieldValue: {
    //                             id: row.FieldID,
    //                             answer: row.Answer || '',
    //                             remark: row.Remark || '',
    //                             isFlaged: row.IsFlaged === '1' ? true : false,
    //                         }
    //                     });
    //                 }
    //             })
    //             .on('end', async () => {
    //                 fs.unlinkSync(filePath);

    //                 if (!isHeaderValidated) {
    //                     return reject(new AppError('BAD_REQUEST', 400, 'CSV format validation failed.'));
    //                 }

    //                 if (results.length === 0) {
    //                     return reject(new AppError('NOT_FOUND', 404, `No data found for module ${moduleId} in the import file`));
    //                 }

    //                 // Process structured data for only the specified module
    //                 const moduleData = {
    //                     id: moduleId,
    //                     name: results[0].moduleName, // All entries will have same module name
    //                     rows: []
    //                 };

    //                 // Create a map to avoid duplicates and maintain references
    //                 const chapterMap = new Map();
    //                 const sectionMap = new Map();

    //                 results.forEach(entry => {
    //                     // Handle chapters
    //                     if (!chapterMap.has(entry.chapterId)) {
    //                         const chapter = {
    //                             id: entry.chapterId,
    //                             title: entry.chapterTitle,
    //                             chapterSections: []
    //                         };
    //                         chapterMap.set(entry.chapterId, chapter);
    //                         moduleData.rows.push(chapter);
    //                     }

    //                     // Handle sections
    //                     const sectionKey = `${entry.chapterId}-${entry.sectionId}`;
    //                     if (!sectionMap.has(sectionKey)) {
    //                         const section = {
    //                             id: entry.sectionId,
    //                             title: entry.sectionTitle,
    //                             sectionFields: []
    //                         };
    //                         sectionMap.set(sectionKey, section);
    //                         chapterMap.get(entry.chapterId).chapterSections.push(section);
    //                     }

    //                     // Handle fields
    //                     const section = sectionMap.get(sectionKey);
    //                     if (!section.sectionFields.some(f => f.id === entry.fieldId)) {
    //                         section.sectionFields.push({
    //                             id: entry.fieldId,
    //                             fieldName: entry.fieldName,
    //                             fieldType: entry.fieldType,
    //                             midEndAns: entry.midEndAns,
    //                             affluentAns: entry.affluentAns,
    //                             premiumAns: entry.premiumAns,
    //                             fieldValue: entry.fieldValue
    //                         });
    //                     }
    //                 });

    //                 resolve(moduleData);
    //             })
    //             .on('error', (error) => reject(error));
    //     });
    // }


    //NOTE - FOR MODULE 2 AND 3 DATA ARE DIRECTLY BEING INSERTED IN THE DB BUT FOR MODULE 1 ONLY FORMATTED STRUCTURE IS BEING SENT TO THE FE 

    async exportKeyRatioData(keyCalFields, keyRatioInputFields, filePath) {
        const calculatedRecords = [];
        for (const [type, sections] of Object.entries(keyCalFields)) {
            for (const [section, fields] of Object.entries(sections)) {
                fields.forEach(field => {
                    // Format range values to prevent Excel date conversion
                    calculatedRecords.push({
                        type,
                        section,
                        field_name: field.field_name,
                        mid_end: `'${field.mid_end}`,
                        premium: `'${field.premium}`,
                        affluent: `'${field.affluent}`,
                        value: field.value,
                        is_flag: field.is_flag ? 'Yes' : 'No',
                        remark: field.remark || ''
                    });
                });
            }
        }

        const inputRecords = [];
        Object.entries(keyRatioInputFields).forEach(([field, value]) => {
            inputRecords.push({
                field,
                value
            });
        });

        // Create CSV content manually for better control over formatting
        let csvContent = '';

        // Add calculated fields section
        csvContent += '"CALCULATED FIELDS"\n';
        csvContent += '"Type","Section","Field Name","Mid-End Range","Premium Range","Affluent Range","Entered Value","Is Flagged","Remark"\n';

        // Add calculated data
        calculatedRecords.forEach(record => {
            csvContent += `"${record.type}","${record.section}","${record.field_name}","${record.mid_end}","${record.premium}","${record.affluent}","${record.value}","${record.is_flag}","${record.remark}"\n`;
        });

        // Add separator
        csvContent += '\n';

        // Add input fields section
        csvContent += '"INPUT FIELDS"\n';
        csvContent += '"Input Field","Value"\n';

        // Add input data
        inputRecords.forEach(record => {
            csvContent += `"${record.field}","${record.value}"\n`;
        });

        // Write to file
        fs.writeFileSync(filePath, csvContent);
        return true;
    }


    async exportProject(userId, projectId, queryParams) {
        let { format = 'csv', allParams, deviations, flags, benchmark } = queryParams
        allParams = parseBoolean(allParams)
        deviations = parseBoolean(deviations)
        flags = parseBoolean(flags)
        benchmark = parseBoolean(benchmark)

        const project = await Project.findOne({
            where: { userId, id: projectId, isDeleted: 0 },
        });
        if (!project) {
            throw new AppError('NOT_FOUND', 404, 'Project not found');
        }

        // Fetch all modules related to the project.
        const modules = await Module.findAll({
            where: { isDeleted: 0 },
            attributes: ['id', 'moduleNumber', 'name'],
            order: [['id', 'ASC']],
            include: [
                {
                    model: Chapter,
                    as: 'moduleChapters',
                    where: { isDeleted: 0 },
                    required: false,
                    attributes: ['id', 'title', 'chapterNumber', 'status'],
                    order: [['id', 'ASC']],
                    include: [
                        {
                            model: Section,
                            as: 'chapterSections',
                            where: { isDeleted: 0 },
                            required: false,
                            attributes: ['id', 'chapterId', 'title'],
                            include: [
                                {
                                    model: SectionField,
                                    as: 'sectionFields',
                                    where: { isDeleted: 0 },
                                    required: false,
                                    attributes: { exclude: ['createdAt', 'updatedAt', 'status', 'isDeleted'] },
                                    include: [
                                        {
                                            model: SectionFieldValue,
                                            as: 'fieldValue',
                                            attributes: ['id', 'answer', 'anyOtherAnswer', 'remark', 'isFlaged'],
                                            where: { projectId },
                                            required: false
                                        },
                                        {
                                            model: SectionFieldOption,
                                            as: 'sectionFieldOptions',
                                            attributes: ['id', 'fieldOption'],
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        let otherModuleExportData = [];

        const formatRangeValue = (value) => {
            if (!value) return value;
            if (/^\d+-\d+$/.test(value)) {
                return `'${value}`;
            }
            return value;
        };

        modules.forEach(module => {
            module.moduleChapters.forEach(chapter => {
                chapter.chapterSections.forEach(section => {
                    section.sectionFields.forEach(field => {
                        otherModuleExportData.push({
                            ModuleID: module.id,
                            ModuleName: module.name,
                            ChapterID: chapter.id,
                            ChapterTitle: chapter.title,
                            SectionID: section.id,
                            SectionTitle: section.title,
                            FieldID: field.id,
                            FieldName: field.fieldName,
                            FieldType: field.fieldType,
                            FieldOptions: field?.sectionFieldOptions?.map(option => option?.fieldOption)?.join(",\n "),
                            MidEndAns: formatRangeValue(field.midEndAns)?.map(option => option)?.join(",\n ") || '',
                            AffluentAns: formatRangeValue(field.affluentAns)?.map(option => option)?.join(",\n ") || '',
                            PremiumAns: formatRangeValue(field.premiumAns)?.map(option => option)?.join(",\n ") || '',
                            Answer: field.fieldValue?.answer || '',
                            AnyOtherAnswer: field.fieldValue?.anyOtherAnswer || '',
                            Remark: field.fieldValue?.remark || '',
                            IsFlaged: field.fieldValue?.isFlaged || 0,
                        });
                    });
                });
            });
        });

        if (!allParams) {
            otherModuleExportData = otherModuleExportData.filter(item => {
                if (deviations && flags) {
                    return (item.Remark && item.Remark.trim() !== '') || item.IsFlaged;
                }
                else if (deviations) {
                    return item.Remark && item.Remark.trim() !== '';
                }
                else if (flags) {
                    return item.IsFlaged;
                }
                else if (benchmark) {
                    return (item.Remark === '' || item.Remark === null);
                }
                return false;
            });
        }
        

        //getting key ratio module data.
        const { keyCalFields, keyRatioFields } = await this.keyRatioFieldService.getCompleteKeyRatioData(
            { project_id: parseInt(projectId) }, { userId }
        )

        // Apply similar filtering to key ratio data if needed
        let filteredKeyCalFields = keyCalFields;
        let filteredKeyRatioFields = keyRatioFields;

        if (!allParams) {
            filteredKeyCalFields = {};
            for (const [type, sections] of Object.entries(keyCalFields)) {
                filteredKeyCalFields[type] = {};
                for (const [section, fields] of Object.entries(sections)) {
                    filteredKeyCalFields[type][section] = fields.filter(field => {
                        if (deviations && flags) {
                            return (field.remark && field.remark.trim() !== '') || field.is_flag === 'Yes';
                        }
                        else if (deviations) {
                            return field.remark && field.remark.trim() !== '';
                        }
                        else if (flags) {
                            return field.is_flag;
                        }
                        else if (benchmark) {
                            return (field.remark === '' || field.remark === null);
                        }
                        return false;
                    });
                }
            }

            filteredKeyRatioFields = keyRatioFields
        }

        let filePath;

        if (format === 'xlsx') {
            const workbook = new ExcelJs.Workbook();
            const projectSheet = workbook.addWorksheet('Module 2 and 3 Data');

            if (otherModuleExportData.length > 0) {
                projectSheet.addRow(Object.keys(otherModuleExportData[0]));
                otherModuleExportData.forEach(row => {
                    projectSheet.addRow(Object.values(row));
                });
            }

            const keyRatioSheet = workbook.addWorksheet('Key Ratio Data');

            const calculatedRecords = [];
            if (filteredKeyCalFields) {
                for (const [type, sections] of Object.entries(filteredKeyCalFields)) {
                    if (sections) {
                        for (const [section, fields] of Object.entries(sections)) {
                            if (fields && fields.length > 0) {
                                fields.forEach(field => {
                                    // Format range values for Excel
                                    const formatRangeValue = (value) => {
                                        if (!value) return value;
                                        if (/^\d+-\d+$/.test(value)) {
                                            return { text: value }; // Force text format in Excel
                                        }
                                        return value;
                                    };

                                    calculatedRecords.push({
                                        type,
                                        section,
                                        field_name: field.field_name,
                                        mid_end: formatRangeValue(field.mid_end),
                                        premium: formatRangeValue(field.premium),
                                        affluent: formatRangeValue(field.affluent),
                                        value: field.value,
                                        is_flag: field.is_flag ? 1 : 0,
                                        remark: field.remark || ''
                                    });
                                });
                            }
                        }
                    }
                }
            }

            if (calculatedRecords.length > 0) {
                keyRatioSheet.addRow(['CALCULATED FIELDS']);
                keyRatioSheet.addRow(Object.keys(calculatedRecords[0]));
                calculatedRecords.forEach(row => {
                    const rowData = Object.values(row).map(value => {
                        // Handle Excel-specific formatting
                        if (value && typeof value === 'object' && value.text) {
                            return value.text;
                        }
                        return value;
                    });
                    keyRatioSheet.addRow(rowData);
                });
            }

            const inputRecords = [];
            if (filteredKeyRatioFields && filteredKeyRatioFields[0]) {
                Object.entries(filteredKeyRatioFields[0]).forEach(([field, value]) => {
                    if (typeof value === 'string' || typeof value === 'number') {
                        inputRecords.push({
                            field,
                            value
                        });
                    }
                });
            }

            if (inputRecords.length > 0) {
                keyRatioSheet.addRow([]); // Empty row
                keyRatioSheet.addRow(['INPUT FIELDS']);
                keyRatioSheet.addRow(Object.keys(inputRecords[0]));
                inputRecords.forEach(row => {
                    keyRatioSheet.addRow(Object.values(row));
                });
            }

            [projectSheet, keyRatioSheet].forEach(sheet => {
                if (sheet.actualRowCount > 1) {
                    sheet.columns.forEach(column => {
                        let maxLength = 0;
                        column.eachCell({ includeEmpty: true }, cell => {
                            const columnLength = cell.value ? cell.value.toString().length : 10;
                            if (columnLength > maxLength) {
                                maxLength = columnLength;
                            }
                        });
                        column.width = Math.min(maxLength + 2, 30);
                    });
                }
            });

            filePath = path.join(tempStorageDir, `project_${projectId}_${Date.now()}_export.xlsx`);
            await workbook.xlsx.writeFile(filePath);
        }
        else if (format === 'csv') {
            let otherModuleFilePath = path.join(tempStorageDir, `module_2_3_${projectId}_${Date.now()}_export.csv`);
            let keyRatioDataFilePath = path.join(tempStorageDir, `keyratio_${projectId}_${Date.now()}_export.csv`);

            await this.exportProjectInCSV(otherModuleExportData, otherModuleFilePath);
            await this.exportKeyRatioData(keyCalFields, keyRatioFields[0], keyRatioDataFilePath);

            // Creating zip file and adding both the file
            const zip = new JSZip();
            zip.file(`module_2_3_data_${projectId}.csv`, fs.readFileSync(otherModuleFilePath));
            zip.file(`key_ratio_data_${projectId}.csv`, fs.readFileSync(keyRatioDataFilePath));

            const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

            const zipFileName = `project_${projectId}_${Date.now()}_export.zip`;
            filePath = path.join(tempStorageDir, zipFileName);
            fs.writeFileSync(filePath, zipContent);

            fs.unlinkSync(otherModuleFilePath);
            fs.unlinkSync(keyRatioDataFilePath)
        }

        return { filePath: filePath, fileFormat: (format === 'csv' || format === 'pdf') ? 'zip' : format };
    }

    async importProject(userId, projectId, moduleId, filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            let isModule1 = moduleId === '1';
            let keyRatioInputFields = {};
            let keyRatioCalculatedFields = {};
            let currentSection = null;
            let headersSeen = false;

            fs.createReadStream(filePath)
                .pipe(csvParser({
                    headers: false // Don't try to auto-detect headers
                }))
                .on('data', (row) => {
                    // Skip empty rows
                    if (!row || Object.keys(row).length === 0) return;

                    if (isModule1) {
                        // Check for section markers
                        if (row['0'] === 'CALCULATED FIELDS') {
                            currentSection = 'calculated';
                            headersSeen = false;
                            return;
                        }
                        else if (row['0'] === 'INPUT FIELDS') {
                            currentSection = 'input';
                            headersSeen = false;
                            return;
                        }

                        if (currentSection === 'calculated') {
                            // Skip the header row after section marker
                            if (!headersSeen) {
                                headersSeen = true;
                                return;
                            }

                            const type = row['0'];
                            const section = row['1'];
                            const fieldName = row['2'];

                            if (type && section && fieldName) {
                                if (!keyRatioCalculatedFields[type]) {
                                    keyRatioCalculatedFields[type] = {};
                                }
                                if (!keyRatioCalculatedFields[type][section]) {
                                    keyRatioCalculatedFields[type][section] = [];
                                }

                                // csv parsing is happening like that kya kare😉
                                keyRatioCalculatedFields[type][section].push({
                                    field_name: fieldName,
                                    mid_end: row['3'] || '',
                                    premium: row['4'] || '',
                                    affluent: row['5'] || '',
                                    value: row['6'] === 'null' ? null : row['6'],
                                    is_flag: row['7'] === 'Yes',
                                    remark: row['8'] === 'null' ? null : row['8']
                                });
                            }
                        }
                        else if (currentSection === 'input') {
                            // Skip the header row after section marker
                            if (!headersSeen) {
                                headersSeen = true;
                                return;
                            }

                            // csv parsing is happening like that kya kare😉
                            const field = row['0'];
                            const value = row['1'];

                            if (field && field !== 'Input Field') {
                                keyRatioInputFields[field] = value === 'null' ? null : value;
                            }
                        }
                    }
                    else {
                        // csv parsing is happening like that kya kare😢
                        if (row['0'] === moduleId) {
                            results.push({
                                moduleId: row['0'],
                                moduleName: row['1'],
                                chapterId: row['2'],
                                chapterTitle: row['3'],
                                sectionId: row['4'],
                                sectionTitle: row['5'],
                                fieldId: row['6'],
                                fieldName: row['7'],
                                fieldType: row['8'],
                                FieldOptions: row['9'],
                                midEndAns: row['10'] || '',
                                affluentAns: row['11'] || '',
                                premiumAns: row['12'] || '',
                                answer: row['13'] || '',
                                anyOtherAnswer: row['14'] || '',
                                remark: row['15'] || '',
                                isFlaged: row['16'] === '1'
                            });
                        }
                    }
                })
                .on('end', async () => {
                    fs.unlinkSync(filePath);

                    try {
                        if (isModule1) {
                            // Handling module 1 (key ratio) import
                            if (Object.keys(keyRatioInputFields).length === 0 &&
                                Object.keys(keyRatioCalculatedFields).length === 0) {
                                return reject(new AppError('NOT_FOUND', 404, `No data found for module ${moduleId} in the import file`));
                            }

                            resolve({ KeyRatioFields: keyRatioInputFields, keyCalFields: keyRatioCalculatedFields });
                        }
                        else {

                            // Handling other modules
                            if (results.length === 0) {
                                return reject(new AppError('NOT_FOUND', 404, `No data found for module ${moduleId} in the import file`));
                            }

                            const chaptersData = results.reduce((acc, item) => {
                                const chapterId = item.chapterId;
                                if (!acc[chapterId]) {
                                    acc[chapterId] = [];
                                }
                                acc[chapterId].push(item);
                                return acc;
                            }, {});

                            for (const [chapterId, chapterData] of Object.entries(chaptersData)) {
                                await this.chapterService.saveChapterData(
                                    userId,
                                    projectId,
                                    moduleId,
                                    chapterId,
                                    chapterData.map(item => ({
                                        sectionId: item.sectionId,
                                        sectionFieldId: item.fieldId,
                                        answer: item?.answer || '',
                                        anyOtherAnswer: item?.anyOtherAnswer || '',
                                        isFlaged: item?.isFlaged,
                                        remark: item?.remark || ''
                                    }))
                                );
                            }
                            resolve({ message: "Project data imported successfully" });
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => reject(error));
        });
    }

}