import { createConsumer } from '@rails/actioncable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const CABLE_URL = (import.meta.env.VITE_CABLE_URL || API_URL.replace(/^http/, 'ws').replace('/api/v1', '')) + '/cable';
const cable = createConsumer(CABLE_URL);

export default cable;