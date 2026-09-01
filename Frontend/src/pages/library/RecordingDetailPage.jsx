import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLmsData } from '../../context/LmsDataContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  Clock,
  UserCheck,
  Calendar,
  FileText,
  Video,
  Download,
  Share2
} from 'lucide-react';

function getVideoEmbedInfo(url = '') {
  if (!url) return { type: 'none' };
  const trimmed = url.trim();

  // Google Drive
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  const driveIdMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch || driveIdMatch) {
    const fileId = driveFileMatch ? driveFileMatch[1] : driveIdMatch[1];
    return {
      type: 'drive',
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`
    };
  }

  // YouTube
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`
    };
  }

  // Direct MP4 / Video Stream
  return {
    type: 'direct',
    src: trimmed
  };
}

export function RecordingDetailPage() {
  const { id } = useParams();
  const { recordings } = useLmsData();

  const recording = recordings.find((r) => r.id === id);

  if (!recording) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-800">Recording Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested video recording could not be found or has been deleted.</p>
        <Link to="/library" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline">
          Back to Recording Library
        </Link>
      </div>
    );
  }

  const embedInfo = getVideoEmbedInfo(recording.videoUrl);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div>
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recording Library
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="purple">{recording.conceptName || recording.subtopicName || 'Video Lecture'}</Badge>
              <Badge variant="indigo">Video Archive</Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{recording.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" icon={Share2}>
              Share Recording
            </Button>
            <Button variant="secondary" size="sm" icon={Download}>
              Download Resources
            </Button>
          </div>
        </div>
      </div>

      {/* Main Video Player Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Video Player */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group aspect-video">
            {embedInfo.type === 'drive' || embedInfo.type === 'youtube' || embedInfo.type === 'vimeo' ? (
              <iframe
                src={embedInfo.embedUrl}
                title={recording.title}
                className="w-full h-full border-0 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                controls
                className="w-full h-full object-cover"
                poster={recording.thumbnail}
              >
                <source src={recording.videoUrl} type="video/mp4" />
                Your browser does not support HTML5 video player.
              </video>
            )}
          </div>

          {/* Description Section */}
          {recording.description && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" /> Recording Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{recording.description}</p>
            </div>
          )}
        </div>

        {/* Right Column: Metadata & Related Recordings */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Lecture Info
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600" /> Instructor
                </span>
                <span className="font-bold text-slate-800">{recording.instructor}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" /> Duration
                </span>
                <span className="font-bold text-slate-800">{recording.duration}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Recorded On
                </span>
                <span className="font-bold text-slate-800">{recording.postedDate}</span>
              </div>
            </div>
          </div>

          {/* Up Next List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Related Recordings
            </h4>

            <div className="space-y-3">
              {recordings
                .filter((r) => r.id !== recording.id)
                .slice(0, 3)
                .map((r) => (
                  <Link
                    key={r.id}
                    to={`/library/${r.id}`}
                    className="flex items-center gap-3 group p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <img
                      src={r.thumbnail}
                      alt={r.title}
                      className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate transition-colors">
                        {r.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{r.duration}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
