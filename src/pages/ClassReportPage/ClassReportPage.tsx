import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionsAPI } from '../../services/api';
import { Clock, FileText, MessageSquare, ArrowLeft, BarChart2 } from 'lucide-react';
import './ClassReportPage.css';

interface SlideVisit {
    slide_id: number;
    position: number;
    start_time: string;
    end_time: string | null;
    duration: number | null;
}

interface BotInteraction {
    type: string;
    prompt: string;
    options: any;
    selected: string;
    timestamp: string;
}

interface SessionReport {
    id: number;
    clase_name: string;
    start_time: string;
    end_time: string | null;
    duration: number | null;
    slide_visits: SlideVisit[];
    bot_interactions: BotInteraction[];
}

const ClassReportPage = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<SessionReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            if (!sessionId) return;
            try {
                const data = await sessionsAPI.getReport(parseInt(sessionId));
                setReport(data);
            } catch (err) {
                console.error('Error fetching report:', err);
                setError('No se pudo cargar el reporte.');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [sessionId]);

    if (loading) return <div className="report-loading">Cargando reporte...</div>;
    if (error || !report) return <div className="report-error">{error || 'Reporte no encontrado'}</div>;

    const formatDuration = (seconds: number | null) => {
        if (seconds === null) return '-';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getMostRequestedType = (interactions: BotInteraction[]) => {
        if (interactions.length === 0) return '-';

        const counts: Record<string, number> = {};
        interactions.forEach(i => {
            counts[i.type] = (counts[i.type] || 0) + 1;
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const maxCount = sorted[0][1];

        // Find all types with the max count
        const topTypes = sorted.filter(entry => entry[1] === maxCount).map(entry => entry[0]);

        const labels: Record<string, string> = {
            question: 'Preguntas',
            example: 'Ejemplos',
            summary: 'Resúmenes'
        };

        return topTypes.map(type => labels[type] || type).join(' / ');
    };

    return (
        <div className="report-container">
            <header className="report-header">
                <button onClick={() => navigate('/clases')} className="btn-back">
                    <ArrowLeft size={20} /> Volver
                </button>
                <h1>Reporte de Clase: {report.clase_name}</h1>
                <div className="report-meta">
                    <div className="meta-item">
                        <Clock size={18} />
                        <span>Duración: {formatDuration(report.duration)}</span>
                    </div>
                    <div className="meta-item">
                        <FileText size={18} />
                        <span>Slides Visitadas: {report.slide_visits.length}</span>
                    </div>
                    <div className="meta-item">
                        <MessageSquare size={18} />
                        <span>Interacciones IA: {report.bot_interactions.length}</span>
                    </div>
                    <div className="meta-item">
                        <BarChart2 size={18} />
                        <span>Más Solicitado: {getMostRequestedType(report.bot_interactions)}</span>
                    </div>
                </div>
            </header>

            <div className="report-grid">
                <section className="report-section timeline-section">
                    <h2><Clock size={20} /> Línea de Tiempo (Slides)</h2>
                    <div className="timeline">
                        {report.slide_visits.map((visit, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-marker">{visit.position}</div>
                                <div className="timeline-content">
                                    <h3>Slide {visit.position}</h3>
                                    <p>Inicio: {formatTime(visit.start_time)}</p>
                                    <p>Duración: {formatDuration(visit.duration)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="report-section interactions-section">
                    <h2><MessageSquare size={20} /> Interacciones con el Bot</h2>
                    {report.bot_interactions.length === 0 ? (
                        <p className="no-data">No hubo interacciones en esta sesión.</p>
                    ) : (
                        <div className="interactions-list">
                            {report.bot_interactions.map((interaction, index) => (
                                <div key={index} className={`interaction-card type-${interaction.type}`}>
                                    <div className="interaction-header">
                                        <span className="interaction-type">{interaction.type.toUpperCase()}</span>
                                        <span className="interaction-time">{formatTime(interaction.timestamp)}</span>
                                    </div>
                                    <div className="interaction-body">
                                        <p><strong>Prompt/Tema:</strong> {interaction.prompt}</p>
                                        {Array.isArray(interaction.options) && interaction.options.length > 0 && (
                                            <div className="interaction-details">
                                                <p><strong>Opciones Generadas:</strong></p>
                                                <ul>
                                                    {interaction.options.map((opt: any, i: number) => {
                                                        const isSelected = opt === interaction.selected || (typeof opt === 'object' && opt?.question === interaction.selected);
                                                        return (
                                                            <li key={i} className={isSelected ? 'selected' : ''}>
                                                                {typeof opt === 'string' ? opt : opt.question}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                        <p className="interaction-selected">
                                            <strong>Seleccionado:</strong> {interaction.selected}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ClassReportPage;
