import { Handler } from "express";
import { prisma } from "../database";

import { HttpError } from "../errors/HttpError";
import { CreateLeadRequestSchema, UpdateLeadRequestSchema } from "../schemas/LeadsRequestSchema";
import { json } from "stream/consumers";

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
    // update a lead
    update: Handler = async (req,res,next) => {
        try {
            const id = Number(req.params.id)
            const body = UpdateLeadRequestSchema.parse(req.body)
            const leadExists = await prisma.lead.findUnique({ where: { id } })
            if (!leadExists) throw new HttpError(404, "lead não encontrado")

            const updatedLead = await prisma.lead.update({ data: body, where: { id } })
            res.status(201).json(updatedLead)
        } catch (error) {
            next(error)
        }
    }
    // delete a lead
    delete: Handler = async (req,res,next) => {
        const id = Number(req.params.id)
        const leadExists = await prisma.lead.findUnique({ where: { id } })
        if (!leadExists) throw new HttpError(404, "lead não encontrado")

        const deletedLead = await prisma.lead.delete({ where: { id } })
        res.status(201).json({ deletedLead })
    }
  }