import { Router } from 'express';
import profile from './profile.js';
import events from './events.js';
import registrations from './registrations.js';
import recordings from './recordings.js';
import notes from './notes.js';
import activity from './activity.js';
import members from './members.js';

const router = Router();

router.use('/profile', profile);
router.use('/events', events);
router.use('/registrations', registrations);
router.use('/recordings', recordings);
router.use('/notes', notes);
router.use('/activity', activity);
router.use('/members', members);

export default router;
