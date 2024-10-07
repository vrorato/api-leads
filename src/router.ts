import { Router } from "express";
import { LeadsController } from "./Controllers/LeadsController";
import { GroupsController } from "./Controllers/GroupsController";
import { CampaignsController } from "./Controllers/CampaignsController";

const router = Router()
const leadsController = new LeadsController()
const groupsController = new GroupsController()
const campaignsController = new CampaignsController

router.get('/leads', leadsController.index)
router.post('/leads', leadsController.create)
router.get('/leads/:id', leadsController.show)
router.put('/leads/:id', leadsController.update)
router.delete('/leads/:id', leadsController.delete)

router.get('/groups', groupsController.index)
router.post('/groups', groupsController.create)
router.get('/groups/:id', groupsController.show)
router.delete('/groups/:id', groupsController.delete)
router.put('/groups/:id', groupsController.update)

router.get('/campaigns', campaignsController.index)
router.post('/campaigns', campaignsController.create)
router.get('/campaigns/:id', campaignsController.show)
router.put('/campaigns/:id', campaignsController.update)
router.delete('/campaigns/:id', campaignsController.delete)

router.get('/campaigns/:campaignId/leads')
router.post('/campaigns/:campaignId/leads')
router.put('/campaigns/:campaignId/leads/:leadId')
router.delete('/campaigns/:campaignId/leads/:leadId')

router.get("/status", async (req, res, next) => {
    try {
      res.json({ message: "OK" })
    } catch (error) {
      next(error)
    }
})

export { router }