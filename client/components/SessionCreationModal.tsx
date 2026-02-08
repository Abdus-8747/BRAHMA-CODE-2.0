import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Sparkles, XCircle } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import axios from 'axios';
import { Slider } from './ui/slider';
import { Loader } from './Loader';

function SessionCreationModal({ onSessionCreated }: { onSessionCreated: () => void }) {

    
    const [formData, setFormData] = useState({
        subject: "",
        topics: [] as string[],
        difficulty: "",
        examType: "",
        count: 0,
    })

    const [topics, setTopics] = useState<string[]>([])
    const [currentTopic, setCurrentTopic] = useState("")
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

  

    const addTopic = () => {
        if (currentTopic.trim() && !topics.includes(currentTopic.trim())) {
        setTopics([...topics, currentTopic.trim()])
        setFormData({...formData, topics: [...topics, currentTopic.trim()]})
        setCurrentTopic("")
        }
    }

    const removeTopic = (index: number) => {
        setTopics(topics.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormData({...formData, topics})
        console.log(formData);
        
        
        try {
            setIsLoading(true)
            const aires = await axios.post('http://localhost:5000/api/ai/generate', formData, {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}})
            
            const questions = aires.data.data
            console.log(questions);

            const res = await axios.post('http://localhost:5000/api/session/create', formData, {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}})
            console.log(res);
            

             const newQuesRes = await axios.post('http://localhost:5000/api/question/add', {questions, sessionId: res.data.sessionId }, {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}})
             console.log(newQuesRes);
             
            setOpen(false)
            onSessionCreated()
            setFormData({
              subject: "",
          topics: [] as string[],
          difficulty: "",
          examType: "",
          count: 0,})

        } catch (error) {
            console.error(error)
        } finally {
          setIsLoading(false)
        }
    }

    if (isLoading) {
      return (
        <Loader fullScreen label='Creating your session...' />
      )
    }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <button className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3.5 rounded-full bg-indigo-600 text-white font-bold shadow-2xl shadow-indigo-300 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 z-40">
      <Plus className="size-5" />
      <span>Add New</span>
    </button>
  </DialogTrigger>

  <DialogContent className="max-w-xl rounded-[2.5rem] border-none p-0 overflow-hidden sm:rounded-[2.5rem]">
    <div className="bg-white p-8 md:p-10">
      <DialogHeader className="mb-8 space-y-2 text-center items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d1a39] text-white shadow-lg shadow-indigo-100">
          <Sparkles className="size-6" />
        </div>
        <DialogTitle className="text-3xl font-black tracking-tight text-[#0d1a39]">
          Create New Session
        </DialogTitle>
        <DialogDescription className="text-slate-500 font-medium">
          Define your assessment parameters to begin.
        </DialogDescription>
      </DialogHeader>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Subject Name */}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase tracking-widest text-[#64748b] ml-1">Subject Name</Label>
          <Input 
            placeholder="e.g. Advanced Neuroscience" 
            className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 font-bold text-[#0d1a39]"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Exam Type */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-[#64748b] ml-1">Exam Type</Label>
            <Select 
              value={formData.examType}
              onValueChange={(value) => setFormData({ ...formData, examType: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-indigo-600 font-bold text-[#0d1a39]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl font-bold">
                <SelectItem value="mid">Mid-Term</SelectItem>
                <SelectItem value="final">Final Exam</SelectItem>
                <SelectItem value="competitive">Competitive</SelectItem>
                <SelectItem value="boards">Board Exam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-[#64748b] ml-1">Difficulty</Label>
            <Select 
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-indigo-600 font-bold text-[#0d1a39]">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="rounded-xl font-bold">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- NEW: Question Range Section --- */}
        <div className="space-y-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center justify-between px-1">
            <Label className="text-xs font-black uppercase tracking-widest text-[#64748b]">Number of Questions</Label>
            <span className="px-3 py-1 bg-[#0d1a39] text-white text-xs font-black rounded-lg">{formData.count || 10}</span>
          </div>
          <Slider
            defaultValue={[10]}
            max={15}
            min={3}
            step={1}
            onValueChange={(value) => setFormData({ ...formData, count: value[0] })}
            className="py-2"
          />
          <div className="flex justify-between px-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            <span>Min: 03</span>
            <span>Max: 15</span>
          </div>
        </div>

        {/* Topics Array */}
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest text-[#64748b] ml-1">Topics Covered</Label>
          <div className="flex gap-2">
            <Input 
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
              placeholder="Press Enter to add" 
              className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 font-bold"
            />
            <Button 
              type="button" 
              onClick={addTopic}
              className="h-12 w-12 rounded-xl bg-[#0d1a39] hover:bg-indigo-700"
            >
              <Plus className="size-5" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pt-1 custom-scrollbar">
            {topics.map((topic: any, index: any) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-xs font-black text-indigo-700"
              >
                {topic}
                <button type="button" onClick={() => removeTopic(index)} className="text-indigo-400 hover:text-indigo-900">
                  <XCircle className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            className="h-12 flex-1 rounded-xl text-[#64748b] font-black uppercase text-[11px] tracking-widest"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="h-12 flex-[2] rounded-xl bg-indigo-600 font-black uppercase text-[11px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-[#0d1a39] transition-all active:scale-[0.98]"
          >
            Generate Assessment
          </Button>
        </div>
      </form>
    </div>
  </DialogContent>
</Dialog>
  )
};

export default SessionCreationModal;
