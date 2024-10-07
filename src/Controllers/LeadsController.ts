import { Handler } from "express";
import { prisma } from "../database";

import { HttpError } from "../errors/HttpError";
import { CreateLeadRequestSchema } from "../schemas/LeadsRequestSchema";

export class LeadsController {
    // show all leads
    index: Handler = async (req, res, next) => {
      try {
        const leads = await prisma.lead.findMany()
        res.json(leads)
      } catch (error) {
        next(error)
      }
    }
    // create new leads
    create: Handler = async (req, res, next) => {
      try {
        const body = CreateLeadRequestSchema.parse(req.body)
        const newLead = await prisma.lead.create({
          data: body
        })
        res.status(201).json(newLead)
      } catch (error) {
        next(error)
      }
    }
    // returns specific lead
    show: Handler = async (req, res, next) => {
      try {
        const lead = await prisma.lead.findUnique({
          where: { id: Number(req.params.id) },
          include:{
            groups: true,
            campaigns: true
          }
        })
  
        if (!lead) throw new HttpError(404, "lead não encontrado")
  
        res.json(lead)
      } catch (error) {
        next(error)
      }
    }
  }