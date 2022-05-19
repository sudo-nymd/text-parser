import * as dotenv from 'dotenv';

dotenv.config();

const getValueAsBoolean = (key: string, defVal = false) => {
    return (process.env[key] === '1' || process.env[key] === 'true') ? true : defVal
}

export const config = {
    DEBUGGING: getValueAsBoolean('DEBUG')
}

