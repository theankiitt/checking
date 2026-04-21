import { Request, Response, NextFunction } from "express";

export const blockBrowserAccess = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secFetchMode = req.headers["sec-fetch-mode"];
  const secFetchDest = req.headers["sec-fetch-dest"];

  if (secFetchMode === "navigate" || secFetchDest === "document") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized",
      message: "API access from browsers is not allowed",
    });
  }

  next();
};
