import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../util/data-source";
import { NetworkEntity } from "../entities/networkEntity";

const networkRepository = AppDataSource.getRepository(NetworkEntity)

export async function validateNetworkParameters(req: Request, res: Response, next: NextFunction) {
    const network = req.params.network;

    // Check if query params are valid strings
    if (typeof network !== 'string') {
        return res.status(400).json({ error: 'Invalid network parameter' });
    }

    try {
        // Get the network name from the database and run to find grid values
        const networkName = await networkRepository.findOne({ where: { network: network }});
        if (!networkName) {
            // Handle case when network is not found
            return res.status(404).json({ error: 'Network not found' });
        } else {
            // Save the query parameters to res.locals
            res.locals.network = network;
        }
    } catch (error) {
        return next(error);
    }

    next();
}

export const validateDateParameters = (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.query.start;
    const endDate = req.query.end;

    // Check if query params are valid strings
    if (typeof startDate !== 'string') {
        return res.status(400).json({ error: 'Invalid start date' });
    }

    if (typeof endDate !== 'string') {
        return res.status(400).json({ error: 'Invalid end date' });
    }

    // Save the query parameters to res.locals
    res.locals.start = startDate;
    res.locals.end = endDate;

    next();
};


export const validateQueryParamsGasDates = (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.query.start;
    const endDate = req.query.end;

    // Check if query params are valid strings
    if (typeof startDate !== 'string') {
        return res.status(400).json({ error: 'Invalid start date' });
    }

    if (typeof endDate !== 'string') {
        return res.status(400).json({ error: 'Invalid end date' });
    }

    // Check if the query params are before the current date
    const endDateCheck: Date = new Date(endDate);
    const currentDate: Date = new Date();

    if (endDateCheck > currentDate) {
        return res.status(400).json({ error: 'Date range not available' });
    }

    // Save the query parameters to res.locals
    res.locals.start = startDate;
    res.locals.end = endDate;
    next();
};

