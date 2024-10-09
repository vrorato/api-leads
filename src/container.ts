import { LeadsController } from "./Controllers/LeadsController"
import { GroupsController } from "./Controllers/GroupsController"
import { CampaignsController } from "./Controllers/CampaignsController"
import { CampaignLeadsController } from "./Controllers/CampaignLeadsController"
import { PrismaLeadsRepository } from "./repositories/prisma/PrismaLeadsRepository"
import { GroupLeadsController } from "./Controllers/GroupLeadsController"


const leadsRepository = new PrismaLeadsRepository()

export const leadsController = new LeadsController(leadsRepository)
export const groupController = new GroupsController()
export const groupLeadsController = new GroupLeadsController()
export const campaignsController = new CampaignsController()
export const campaignLeadsController = new CampaignLeadsController()