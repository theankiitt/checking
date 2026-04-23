'use client';

import { useState, useEffect } from 'react';
import { Save, Eye, Edit3, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import toast from 'react-hot-toast';
import { getApiBaseUrl } from '@/utils/api';

interface StaticPageData {
  id?: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
  updatedAt?: string;
}

const PAGE_SLUG = 'terms-and-conditions';

export default function TermsAndConditionsPage() {
  const [pageData, setPageData] = useState<StaticPageData>({
    slug: PAGE_SLUG,
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    setIsLoading(true);
    try {
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/api/v1/pages/${PAGE_SLUG}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPageData(result.data);
        }
      }
    } catch (error) {
      toast.error('Failed to load page data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const API_BASE_URL = getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/api/v1/pages/${PAGE_SLUG}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: pageData.title,
          content: pageData.content,
          metaTitle: pageData.metaTitle,
          metaDescription: pageData.metaDescription,
          isActive: pageData.isActive,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setPageData(result.data);
        }
        setIsEditing(false);
        toast.success('Terms & Conditions updated successfully!');
      } else {
        toast.error('Failed to save page');
      }
    } catch (error) {
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewMode(false);
    loadPageData();
  };

  const handleInputChange = (field: keyof StaticPageData, value: string | boolean) => {
    setPageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Terms & Conditions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Terms & Conditions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
            <p className="text-gray-600">Manage your website's terms and conditions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            {!isEditing && !previewMode && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${pageData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {pageData.isActive ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: {pageData.updatedAt ? new Date(pageData.updatedAt).toLocaleString() : 'Never'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={pageData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  disabled={!isEditing}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {previewMode ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageData.title}</h1>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={pageData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Enter page title"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Content</h2>
              <RichTextEditor
                value={pageData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Write your terms and conditions here..."
                height={600}
                className="min-h-[600px]"
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={pageData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Enter meta title for SEO"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {pageData.metaTitle.length}/60 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={pageData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Enter meta description for SEO"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {pageData.metaDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-end space-x-3 bg-gray-50 rounded-lg p-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !pageData.title.trim() || !pageData.content.trim()}
                  className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
