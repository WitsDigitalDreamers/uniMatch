import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { careersService } from '@/services/careersService';
import { Career } from '@/types';
import { courses, universities, checkCourseEligibility } from '@/data/mockData';

const Chat = () => {
  const { student } = useAuth();
  const [searchParams] = useSearchParams();
  const careerId = searchParams.get('careerId') || '';

  const selectedCareer: Career | null = useMemo(() => {
    if (!careerId) return null;
    const all = careersService.getAllCareers();
    return all.find(c => c.career_id === careerId) || null;
  }, [careerId]);

  const [messages, setMessages] = useState<Array<{ role: 'bot' | 'user'; content: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (selectedCareer && messages.length === 0) {
      const welcome = `Hi! I'm your career assistant. What would you like to know about ${selectedCareer.name}?`;
      setMessages([{ role: 'bot', content: welcome }]);
    }
  }, [selectedCareer, messages.length]);

  const generateChatResponse = (question: string, career: Career): string => {
    const q = question.toLowerCase();
    const parts: string[] = [];

    parts.push(`${career.name}: ${career.description}`);

    const requiredCourseIds = career.required_courses || [];
    const altCourseIds = career.alternative_courses || [];
    const relatedCourses = courses.filter(c => requiredCourseIds.includes(c.course_id) || altCourseIds.includes(c.course_id));

    if (q.includes('require') || q.includes('subject') || q.includes('aps') || q.includes('eligib')) {
      const reqSummaries = relatedCourses.slice(0, 3).map(c => {
        const reqs: string[] = [];
        if (c.requirements.minimum_aps) reqs.push(`APS ≥ ${c.requirements.minimum_aps}`);
        (['mathematics','english','physical_sciences','life_sciences','accounting','economics'] as const).forEach(sub => {
          const r = c.requirements[sub as keyof typeof c.requirements] as number | undefined;
          if (typeof r === 'number') reqs.push(`${sub.replace('_',' ')} ≥ ${r}%`);
        });
        return `- ${c.name}: ${reqs.join(', ') || 'See prospectus'}`;
      });
      parts.push('Typical entry requirements (examples):');
      parts.push(...reqSummaries);
      if (student) {
        const eligibility = relatedCourses.map(c => {
          const e = checkCourseEligibility(student, c);
          return `• ${c.name}: ${e.eligible ? 'Eligible' : `Not yet (missing: ${e.missing.slice(0,2).join('; ') || 'requirements'})`}`;
        }).slice(0, 3);
        parts.push('Your current fit:');
        parts.push(...eligibility);
      }
    }

    if (q.includes('university') || q.includes('where') || q.includes('offer')) {
      const uniNames = Array.from(new Set(relatedCourses.map(c => universities.find(u => u.university_id === c.university_id)?.name).filter(Boolean))).slice(0, 5);
      if (uniNames.length) parts.push(`Universities offering relevant programs: ${uniNames.join(', ')}.`);
    }

    if (q.includes('salary') || q.includes('pay') || q.includes('money')) {
      const entry = career.average_salary?.entry_level || career.average_salary_entry;
      const mid = career.average_salary?.mid_level || career.average_salary_mid;
      const senior = career.average_salary?.senior_level || career.average_salary_senior;
      const salaryParts = [entry && `Entry ~ R${entry.toLocaleString()}`, mid && `Mid ~ R${mid.toLocaleString()}`, senior && `Senior ~ R${senior.toLocaleString()}`].filter(Boolean) as string[];
      if (salaryParts.length) parts.push(`Typical salaries: ${salaryParts.join(' | ')}`);
    }
    if (q.includes('outlook') || q.includes('demand') || q.includes('growth')) {
      parts.push(`Job outlook: ${career.job_market_outlook}${career.growth_rate ? `, growth rate ~ ${career.growth_rate}%` : ''}.`);
    }

    if (q.includes('skill') || q.includes('need to learn')) {
      const skills = (career.skills_required || []).slice(0, 6);
      if (skills.length) parts.push(`Key skills: ${skills.join(', ')}.`);
    }

    if (parts.length <= 1) {
      parts.push('Ask about requirements, APS, universities, salary, outlook, or skills.');
    }
    return parts.join('\n');
  };

  const sendMessage = () => {
    if (!selectedCareer || !userInput.trim()) return;
    const question = userInput.trim();
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setUserInput('');
    setIsTyping(true);
    fetch(import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: `You are a helpful career assistant. Be concise and use the provided career context when relevant. Career: ${selectedCareer.name}.`,
        messages: [
          { role: 'user', content: question }
        ]
      })
    })
    .then(async (r) => {
      if (!r.ok) throw new Error('chat api error');
      const data = await r.json();
      const content = data?.content as string | undefined;
      if (!content) throw new Error('no content');
      setMessages(prev => [...prev, { role: 'bot', content }]);
    })
    .catch(() => {
      const fallback = generateChatResponse(question, selectedCareer);
      setMessages(prev => [...prev, { role: 'bot', content: fallback }]);
    })
    .finally(() => setIsTyping(false));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Career Assistant{selectedCareer ? ` — ${selectedCareer.name}` : ''}</h1>
            <p className="text-sm text-gray-500">Ask about requirements, APS, universities, salary, outlook, or skills.</p>
          </div>
          <Link to="/career-planning" className="text-sm text-blue-600 hover:underline">Back to Career Planning</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {!selectedCareer ? (
          <div className="text-gray-600">No career selected. Open chat from a career card.</div>
        ) : (
          <div className="bg-white border rounded-lg p-4">
            <div className="space-y-3 max-h-[60vh] overflow-y-auto mb-4">
              {messages.map((m, idx) => (
                <div key={idx} className={m.role === 'bot' ? 'bg-muted rounded-md p-3 text-sm' : 'text-sm p-3 border rounded-md'}>
                  {m.content}
                </div>
              ))}
              {isTyping && (
                <div className="text-xs text-muted-foreground">Assistant is typing…</div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your question..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              />
              <Button onClick={sendMessage} disabled={!userInput.trim() || isTyping}>Send</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;


