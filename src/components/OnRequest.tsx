import React, { useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle } from 'lucide-react';

const OnRequest: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [form, setForm] = useState({
    cutName: '',
    fullName: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    handleFile(f);
  };

  const handleFile = (f?: File) => {
    if (!f) return;
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      setErrors({ ...errors, file: 'Only JPG/PNG allowed' });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, file: 'File must be under 10MB' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setImageName(f.name || null);
    if (errors.file) setErrors({ ...errors, file: '' });
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    if (errors.general) setErrors({ ...errors, general: '' });
  };

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!form.cutName.trim()) e.cutName = 'Required';
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `New cut request: ${form.cutName}`,
          cutName: form.cutName,
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          notes: form.notes || 'No additional notes',
          imagePresent: Boolean(preview),
          imageData: preview,
          imageName: imageName || undefined
        })
      });

      if (!response.ok) throw new Error('Form submission failed');

      setSubmitted(true);
      setForm({ cutName: '', fullName: '', phone: '', email: '', notes: '' });
      setPreview(null);
      setImageName(null);

    } catch (error) {
      console.error('Form submission failed:', error);
      setErrors({ general: 'Failed to submit request. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="on-request-page">
      <div className="on-request-container">
        <div className="on-request-header">
          <h1>On Request</h1>
          <p>If the cut you are looking for is not currently available, please submit your request. We will source it and provide you with an update within 24–48 hours. Thank you for your inquiry.</p>
        </div>
        
        <div className="request-card">
          {!submitted ? (
            <form onSubmit={onSubmit} className="request-form">
              {errors.general && (
                <div className="error-message">
                  {errors.general}
                </div>
              )}
              
              <div
                className="upload-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={openFilePicker}
                role="button"
                tabIndex={0}
              >
                {preview ? (
                  <div className="upload-preview">
                    <img src={preview} alt="Preview" />
                    <button type="button" className="btn-outline" onClick={(e) => { e.stopPropagation(); setPreview(null); }}>
                      <X size={16} /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="upload-instructions">
                    <UploadCloud size={24} />
                    <p>Drag & drop an image (JPG/PNG, max 10MB) or click to upload</p>
                    {errors.file && <span className="field-error">{errors.file}</span>}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0] || undefined)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cutName">Name of the cut</label>
                <input 
                  id="cutName" 
                  name="cutName" 
                  value={form.cutName} 
                  onChange={onChange}
                  className="request-input"
                  placeholder="e.g., Entraña, Bife de Chorizo"
                  required
                  disabled={isSubmitting}
                />
                {errors.cutName && <span className="field-error">{errors.cutName}</span>}
              </div>

              <div className="request-form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full name</label>
                  <input 
                    id="fullName" 
                    name="fullName" 
                    value={form.fullName} 
                    onChange={onChange}
                    className="request-input"
                    placeholder="Your full name"
                    required
                    disabled={isSubmitting}
                  />
                  {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input 
                    id="phone" 
                    name="phone" 
                    value={form.phone} 
                    onChange={onChange}
                    className="request-input"
                    placeholder="Your phone number"
                    required
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  value={form.email} 
                  onChange={onChange}
                  className="request-input"
                  placeholder="your.email@example.com"
                  required
                  disabled={isSubmitting}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  rows={4} 
                  value={form.notes} 
                  onChange={onChange}
                  className="request-textarea"
                  placeholder="Any additional details about your request..."
                  disabled={isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary request-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit request'}
              </button>
            </form>
          ) : (
            <div className="success-state">
              <CheckCircle size={48} />
              <h3>Request received</h3>
              <p>Thanks! We'll contact you shortly with availability and next steps.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnRequest;
