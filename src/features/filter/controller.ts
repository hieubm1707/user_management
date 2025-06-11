import { Request, Response } from 'express';
import { filterSalaries } from './service';
import { FilterDto } from './dto';

export const filterSalariesController = async (
  req: Request<{}, {}, {}, FilterDto>,
  res: Response
) => {
  try {
    const { data, total } = await filterSalaries(req.query); // Expect { data, total } from service
    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        total, // Use total from service
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error in filterSalariesController: ${errorMessage}`);
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
};