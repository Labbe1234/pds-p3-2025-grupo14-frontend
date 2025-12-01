import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionsAPI } from '../../services/api';
import { Clock, Calendar, MessageSquare, ArrowRight, FileText, Trash2 } from 'lucide-react';
import './ClassReportsListPage.css';

interface SessionSummary {
    id: number;
    clase_name: string;
    subject: string;
    start_time: string;
    duration: number | null;
    interactions_count: number;
}

const ClassReportsListPage = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await sessionsAPI.getAll();
                setSessions(data);
            } catch (err) {
                console.error('Error fetching sessions:', err);
                setError('No se pudieron cargar los reportes.');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const formatDuration = (seconds: number | null) => {
        if (seconds === null) return 'En curso';
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString([], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async (e: React.MouseEvent, sessionId: number) => {
        e.stopPropagation(); // Evitar navegar al reporte
        if (window.confirm('¿Estás seguro de que quieres eliminar este reporte? Esta acción no se puede deshacer.')) {
            try {
                await sessionsAPI.delete(sessionId);
                setSessions(prev => prev.filter(s => s.id !== sessionId));
            } catch (err) {
                console.error('Error deleting session:', err);
                alert('Error al eliminar el reporte.');
            }
        }
    };

    if (loading) return <div className="reports-list-loading">Cargando historial...</div>;
    if (error) return <div className="reports-list-error">{error}</div>;

    return (
        <div className="reports-list-container">
            <header className="reports-list-header">
                <h1>Historial de Clases</h1>
                <p>Revisa el desempeño y las interacciones de tus sesiones pasadas.</p>
            </header>

            {sessions.length === 0 ? (
                <div className="no-sessions">
                    <FileText size={48} />
                    <p>No hay sesiones registradas aún.</p>
                    <button onClick={() => navigate('/clases')} className="btn-primary">
                        Ir a mis Clases
                    </button>
                </div>
            ) : (
                <div className="sessions-grid">
                    {sessions.map((session) => (
                        <div key={session.id} className="session-card" onClick={() => navigate(`/sessions/${session.id}`)}>
                            <div className="session-card-header">
                                <h3>{session.clase_name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="subject-badge">{session.subject}</span>
                                    <button
                                        onClick={(e) => handleDelete(e, session.id)}
                                        className="btn-delete-report"
                                        title="Eliminar reporte"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="session-card-body">
                                <div className="session-info">
                                    <Calendar size={16} />
                                    <span>{formatDate(session.start_time)}</span>
                                </div>
                                <div className="session-info">
                                    <Clock size={16} />
                                    <span>{formatDuration(session.duration)}</span>
                                </div>
                                <div className="session-info">
                                    <MessageSquare size={16} />
                                    <span>{session.interactions_count} interacciones</span>
                                </div>
                            </div>

                            <div className="session-card-footer">
                                <span>Ver reporte completo</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassReportsListPage;
