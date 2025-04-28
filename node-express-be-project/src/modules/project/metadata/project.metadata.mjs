export const projectMetadata = {
    projectInfo: {
        name: {
            label: "Project Name",
            type: "input",
            dataType: "string",
            required: true,
        },
        category: {
            label: "Category",
            type: "select",
            dataType: "string",
            required: true,
            options: ["mid-end", "premium", "affluent"],
        },
        projectType: {
            label: "Project Type",
            type: "select",
            dataType: "string",
            required: true,
            options: ["residential", "commercial"],
        },
        description: {
            label: "Description",
            type: "textarea",
            dataType: "string",
            required: false,
        },
        location: {
            label: "Location",
            type: "input",
            dataType: "text",
            required: true,
        },
    },
    userInfo: {
        userName: {
            label: "User Name",
            type: "input",
            dataType: "string",
            required: true,
        },
        userEmail: {
            label: "User Email",
            type: "input",
            dataType: "string",
            required: true,
            pattern: "email",
        },
        userNumber: {
            label: "User Phone",
            type: "input",
            dataType: "string",
            required: true,
        },
        date: {
            label: "Date",
            type: "date",
            dataType: "date",
            required: false,
        },
        userDesignation: {
            label: "Designation",
            type: "input",
            dataType: "string",
            required: true,
        },
    }
};


export const CSV_HEADERS = [
    { id: 'ModuleID', title: 'ModuleID' },
    { id: 'ModuleName', title: 'ModuleName' },
    { id: 'ChapterID', title: 'ChapterID' },
    { id: 'ChapterTitle', title: 'ChapterTitle' },
    { id: 'SectionID', title: 'SectionID' },
    { id: 'SectionTitle', title: 'SectionTitle' },
    { id: 'FieldID', title: 'FieldID' },
    { id: 'FieldName', title: 'FieldName' },
    { id: 'FieldType', title: 'FieldType' },
    { id: 'FieldOptions', title: 'FieldOptions' },
    { id: 'MidEndAns', title: 'MidEndAns' },
    { id: 'AffluentAns', title: 'AffluentAns' },
    { id: 'PremiumAns', title: 'PremiumAns' },
    { id: 'Answer', title: 'Answer' },
    { id: 'AnyOtherAnswer', title: 'AnyOtherAnswer' },
    { id: 'Remark', title: 'Remark' },
    { id: 'IsFlaged', title: 'IsFlaged' },
];

// Extracting only the header keys for validation
export const CSV_HEADER_KEYS = CSV_HEADERS.map(header => header.id);


export const KEY_RATIO_CSV_HEADERS = [
    { id: 'type', title: 'Type' },
    { id: 'section', title: 'Section' },
    { id: 'field_name', title: 'Field Name' },
    { id: 'mid_end', title: 'Mid-End Range' },
    { id: 'premium', title: 'Premium Range' },
    { id: 'affluent', title: 'Affluent Range' },
    { id: 'value', title: 'Entered Value' },
    { id: 'is_flag', title: 'Is Flagged' },
    { id: 'remark', title: 'Remark' }
];

export const KEY_RATIO_INPUT_HEADERS = [
    { id: 'field', title: 'Input Field' },
    { id: 'value', title: 'Value' }
];