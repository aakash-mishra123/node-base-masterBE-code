
import { Chapter } from './chapter/model/chapter.model.mjs';
import { Module } from './module/model/module.model.mjs';
import { Project } from './project/model/project.model.mjs';
import { SectionField } from './sectionField/model/sectionField.model.mjs';
import { Section } from './section/model/section.model.mjs';
import User from './auth/model/user.model.mjs';
import SectionFieldValue from './sectionFieldValues/model/sectionFieldValue.model.mjs';
import SectionFieldOption from './sectionFieldOptions/model/sectionFieldOpition.model.mjs';
import ProjectModule from './projectModule/model/projectModule.model.mjs';
import KeyCalField from './keyRatioFields/model/keyCalculatedRatio.model.mjs';
import KeyRatioField from './keyRatioFields/model/keyRatioFields.model.mjs';
import CalculatedRatios from './keyRatioFields/model/calculatedRatios.models.mjs';

// Associations
Project.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Project, { foreignKey: 'userId' });

Chapter.belongsTo(Module, { foreignKey: 'moduleId', onDelete: 'CASCADE' });
Module.hasMany(Chapter, { foreignKey: 'moduleId', as: 'moduleChapters' });

Chapter.hasMany(Section, { foreignKey: 'chapterId', as: 'chapterSections', onDelete: 'CASCADE' });
Section.belongsTo(Chapter, { foreignKey: 'chapterId', as: 'chapter' });

Section.hasMany(SectionField, { foreignKey: 'sectionId', as: 'sectionFields', onDelete: 'CASCADE' });
SectionField.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// -------------------------SECTION FIELD VALUE OPTION ASSOCIATION----------------------
SectionFieldValue.belongsTo(Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Project.hasMany(SectionFieldValue, { foreignKey: 'projectId' });

SectionFieldValue.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(SectionFieldValue, { foreignKey: 'userId' });

SectionFieldValue.belongsTo(Module, { foreignKey: 'moduleId', onDelete: 'CASCADE' });
Module.hasMany(SectionFieldValue, { foreignKey: 'moduleId' });

SectionFieldValue.belongsTo(Chapter, { foreignKey: 'chapterId', as: 'chapterDetails', onDelete: 'CASCADE' });
Chapter.hasMany(SectionFieldValue, { foreignKey: 'chapterId' });

SectionFieldValue.belongsTo(Section, { foreignKey: 'sectionId', as: 'sectionDetails', onDelete: 'CASCADE' });
Section.hasMany(SectionFieldValue, { foreignKey: 'sectionId' });

SectionField.hasOne(SectionFieldValue, { foreignKey: 'sectionFieldId', as: 'fieldValue' });
SectionFieldValue.belongsTo(SectionField, { foreignKey: 'sectionFieldId', as: 'fieldValue' });
//----------------------------------------------------------------------------------------

// --------------------SECTION FIELD OPTION ASSOCICATION DEFINITION----------------------
SectionFieldOption.belongsTo(SectionField, { foreignKey: 'sectionFieldId', as: 'sectionField', onDelete: 'CASCADE' });
SectionField.hasMany(SectionFieldOption, { foreignKey: 'sectionFieldId', as: 'sectionFieldOptions' });

SectionFieldOption.belongsTo(Section, { foreignKey: 'sectionId', onDelete: 'CASCADE' });
Section.hasMany(SectionFieldOption, { foreignKey: 'sectionId' });

SectionFieldOption.belongsTo(Chapter, { foreignKey: 'chapterId', onDelete: 'CASCADE' });
Chapter.hasMany(SectionFieldOption, { foreignKey: 'chapterId' });

SectionFieldOption.belongsTo(Module, { foreignKey: 'moduleId', onDelete: 'CASCADE' });
Module.hasMany(SectionFieldOption, { foreignKey: 'moduleId' });
// --------------------------------------------------------------------------------------

//-----------------------PROJECT MODULE ASSOCICATION DEFINITION ---------------------
ProjectModule.belongsTo(Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Project.hasMany(ProjectModule, { foreignKey: 'projectId', as: 'projectModules' });

ProjectModule.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(ProjectModule, { foreignKey: 'userId', as: 'userModules' });

ProjectModule.belongsTo(Module, { foreignKey: 'moduleId', onDelete: 'CASCADE' });
Module.hasOne(ProjectModule, { foreignKey: 'moduleId', as: 'projectModule' });

// -----------------------------------------------------------------

// -------------------KEY RATIO MODELS ASSOCIATION---------------------------------------
KeyCalField.belongsTo(Module, { foreignKey: 'module_id', onDelete: 'CASCADE' });
Module.hasMany(KeyCalField, { foreignKey: 'module_id', as: 'keyCalField' });

KeyRatioField.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' })
Project.hasOne(KeyRatioField, { foreignKey: 'project_id', as: 'KeyRatioField' });

KeyRatioField.belongsTo(Module, { foreignKey: 'module_id', onDelete: 'CASCADE' })
Module.hasMany(KeyRatioField, { foreignKey: 'module_id', as: 'KeyRatioField' });

CalculatedRatios.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
User.hasMany(CalculatedRatios, { foreignKey: 'user_id', as: 'CalculatedRatios' });

CalculatedRatios.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' })
Project.hasMany(CalculatedRatios, { foreignKey: 'project_id', as: 'CalculatedRatios' });

CalculatedRatios.belongsTo(KeyCalField, { foreignKey: 'field_id', onDelete: 'CASCADE' })
KeyCalField.hasMany(CalculatedRatios, { foreignKey: 'field_id', as: 'CalculatedRatios' });


export {
    Chapter,
    Module,
    Project,
    SectionField,
    Section,
    User,
    SectionFieldValue,
    SectionFieldOption,
    ProjectModule,
    KeyCalField,
    KeyRatioField,
    CalculatedRatios,
};