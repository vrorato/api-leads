import { Handler } from "express";
import { prisma } from "../database";
import { HttpError } from "../errors/HttpError";
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema";
import { Prisma } from "@prisma/client";

export class LeadsController {
    // show all leads
    index: Handler = async (req, res, next) => {
      try {
        const query = GetLeadsRequestSchema.parse(req.query)
        const { page = "1", pageSize ="10", name, status, sortBy = "name", order = "asc" } = query

        const pageNumber = Number(page)
        const pageSizeNumber = Number(pageSize)

        const where: Prisma.LeadWhereInput = {}

        if(name) where.name = { contains: name,mode:"insensitive"}
        if(status) where.status = status

        const leads = await prisma.lead.findMany({
            where,
            skip: (pageNumber-1)*pageSizeNumber,
            take: pageSizeNumber,
            orderBy: { [sortBy]: order }
        })

        const total = await prisma.lead.count({ where })

        res.json({
            data: leads,
            meta: {
                page: pageNumber,
                pageSize: pageSizeNumber,
                total,
                totalPages: Math.ceil(total / pageSizeNumber)
            }
        })
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