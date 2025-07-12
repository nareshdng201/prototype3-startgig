"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  GraduationCap, 
  Briefcase,
  FileText,
  Calendar,
  Building,
  Search,
  X
} from "lucide-react"

interface SessionUser {
  companyName: string
  _id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface Application {
  _id: string
  jobId: {
    _id: string
    title: string
    company: string
  }
  studentId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    education: string
    skills: string[]
    experience?: string
  }
  status: 'pending' | 'accepted' | 'rejected'
  cvUrl?: string
  coverLetter?: string
  createdAt: string
  updatedAt: string
}

export default function ApplicationsPage() {
  const { data: session } = useSession() as { data: { user: SessionUser } | null }
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [skillSearch, setSkillSearch] = useState<string>("")
  const [debouncedSkillSearch, setDebouncedSkillSearch] = useState<string>("")
  const { toast } = useToast()

  // Debounce the skill search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSkillSearch(skillSearch)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [skillSearch])

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (jobId) {
        params.append('jobId', jobId)
      }
      
      if (debouncedSkillSearch.trim()) {
        params.append('skills', debouncedSkillSearch.trim())
      }
      
      const url = `/api/employer/applications${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [jobId, debouncedSkillSearch, toast])

  useEffect(() => {
    if (session?.user) {
      fetchApplications()
    }
  }, [session?.user, fetchApplications])

  const handleClearSearch = () => {
    setSkillSearch("")
  }

  // Get unique skills from all applications for suggestions
  const getAllSkills = () => {
    const allSkills = new Set<string>()
    applications.forEach(app => {
      if (app.studentId.skills) {
        app.studentId.skills.forEach(skill => allSkills.add(skill))
      }
    })
    return Array.from(allSkills).sort()
  }

  const handleSkillSuggestion = (skill: string) => {
    if (skillSearch) {
      setSkillSearch(`${skillSearch}, ${skill}`)
    } else {
      setSkillSearch(skill)
    }
  }

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/employer/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast({
        title: "Status updated",
        description: `Application has been ${newStatus}`,
      })

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      )
    } catch (error) {
      console.error('Error updating application status:', error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredApplications = applications?.filter(app => {
    if (selectedStatus === "all") return true
    return app.status === selectedStatus
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  }

    if (isLoading || !applications) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
        </div>
        )
    }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/employer/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold">
                  {jobId ? 'Job Applications' : 'All Applications'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {jobId && (
                <Link href="/employer/dashboard/applications">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Applications
                  </Button>
                </Link>
              )}
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {session?.user?.companyName}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Search by Skills</h3>
                </div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter skills (e.g., JavaScript, React, Python) - separate multiple skills with commas"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    {skillSearch && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={fetchApplications}
                    disabled={isLoading}
                    className="px-6"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                {skillSearch && (
                  <div className="text-sm text-gray-600">
                    <p>Searching for applicants with skills: <span className="font-medium">{skillSearch}</span></p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: You can search for multiple skills by separating them with commas (e.g., "JavaScript, React, Node.js")
                    </p>
                    {skillSearch !== debouncedSkillSearch && (
                      <p className="text-xs text-blue-600 mt-1">
                        ⏱️ Search will update automatically in a moment...
                      </p>
                    )}
                  </div>
                )}
                
                {/* Skill Suggestions */}
                {applications.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Available skills in applications:</p>
                    <div className="flex flex-wrap gap-2">
                      {getAllSkills().slice(0, 10).map((skill, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSkillSuggestion(skill)}
                          className="text-xs h-7 px-2"
                        >
                          {skill}
                        </Button>
                      ))}
                      {getAllSkills().length > 10 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{getAllSkills().length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Results Summary */}
        {debouncedSkillSearch && (
          <div className="mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Search Results for "{debouncedSkillSearch}"
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedStatus === "all" 
                    ? "You haven't received any applications yet." 
                    : `No ${selectedStatus} applications found.`
                  }
                </p>
                <Link href="/employer/dashboard/add">
                  <Button>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post New Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {application.studentId.firstName} {application.studentId.lastName}
                        </h3>
                        <Badge className={`${getStatusColor(application.status)} border flex items-center space-x-1`}>
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{application.jobId.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{application.jobId.title}</span>
                        </div>
                      </div>
                    </div>
                    {application.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 border-green-200"
                          onClick={() => handleUpdateApplicationStatus(application._id, 'accepted')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 border-red-200"
                          onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Applicant Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Applicant Details</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{application.studentId.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{application.studentId.education}</span>
                        </div>
                        {application.studentId.experience && (
                          <div className="flex items-start space-x-2 text-sm">
                            <Briefcase className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-600">{application.studentId.experience}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Skills */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {application.studentId.skills.map((skill, index) => {
                            const isMatching = debouncedSkillSearch && debouncedSkillSearch.split(',').some(searchSkill => 
                              skill.toLowerCase().includes(searchSkill.trim().toLowerCase())
                            )
                            return (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className={`${
                                  isMatching 
                                    ? 'bg-green-100 text-green-800 border-green-300' 
                                    : 'bg-blue-50 text-blue-700'
                                }`}
                              >
                                {skill}
                                {isMatching && <CheckCircle className="h-3 w-3 ml-1" />}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Application Details</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Applied on {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Last updated {new Date(application.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Cover Letter */}
                      {application.coverLetter && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Cover Letter</h5>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {application.coverLetter}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* CV Download */}
                      {application.cvUrl && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Resume/CV</h5>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(application.cvUrl, '_blank')}
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download CV
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 