import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  students, 
  generateStudentQualificationReport, 
  getCourseImprovementPlan,
  type StudentQualificationReport,
  type QualificationResult
} from '@/data/mockData';
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  Target,
  Award,
  Users,
  BarChart3
} from 'lucide-react';

const QualificationDemo = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [qualificationReport, setQualificationReport] = useState<StudentQualificationReport | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<QualificationResult | null>(null);

  const handleGenerateReport = () => {
    if (!selectedStudentId) return;
    
    const student = students.find(s => s.id_number === selectedStudentId);
    if (student) {
      const report = generateStudentQualificationReport(student);
      setQualificationReport(report);
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <TrendingUp className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Course Qualification Analysis</h1>
        <p className="text-muted-foreground">
          Analyze student marks against university course requirements to find eligible courses and improvement opportunities.
        </p>
      </div>

      {/* Student Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>Choose a student to analyze their course qualifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Select a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id_number} value={student.id_number}>
                    {student.first_name} {student.last_name} - {student.id_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} disabled={!selectedStudentId}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Qualification Report */}
      {qualificationReport && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">APS Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{qualificationReport.apsScore}</div>
                <p className="text-xs text-muted-foreground">
                  Admission Point Score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eligible Courses</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {qualificationReport.summary.totalEligible}
                </div>
                <p className="text-xs text-muted-foreground">
                  Courses you qualify for
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Improvement Needed</CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {qualificationReport.summary.totalImprovement}
                </div>
                <p className="text-xs text-muted-foreground">
                  Courses needing improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {qualificationReport.summary.averageConfidence.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average confidence score
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Recommendations</CardTitle>
              <CardDescription>Best course matches based on your qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualificationReport.topRecommendations.slice(0, 5).map((result, index) => (
                  <div 
                    key={result.course.course_id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedCourse(result)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{result.course.name}</h3>
                        <Badge className={getConfidenceColor(result.confidenceLevel)}>
                          {getConfidenceIcon(result.confidenceLevel)}
                          <span className="ml-1 capitalize">{result.confidenceLevel}</span>
                        </Badge>
                        {result.eligible && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Eligible
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {result.university.name} • {result.course.faculty}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>APS: {result.apsScore}/{result.requiredAPS}</span>
                        <span>Priority: {result.priority.toFixed(0)}</span>
                        <span>Cost: R{result.course.estimated_cost.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eligible Courses */}
          {qualificationReport.eligibleCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Eligible Courses ({qualificationReport.eligibleCourses.length})
                </CardTitle>
                <CardDescription>Courses you currently qualify for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qualificationReport.eligibleCourses.slice(0, 6).map(result => (
                    <div 
                      key={result.course.course_id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedCourse(result)}
                    >
                      <h3 className="font-semibold mb-2">{result.course.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {result.university.name} • {result.course.faculty}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span>APS: {result.apsScore}/{result.requiredAPS}</span>
                        <span>R{result.course.estimated_cost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Improvement Courses */}
          {qualificationReport.improvementCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  Courses Needing Improvement ({qualificationReport.improvementCourses.length})
                </CardTitle>
                <CardDescription>Courses you can qualify for with some improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qualificationReport.improvementCourses
                    .filter(c => c.confidenceLevel === 'medium')
                    .slice(0, 6)
                    .map(result => (
                    <div 
                      key={result.course.course_id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedCourse(result)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{result.course.name}</h3>
                        <Badge className={getConfidenceColor(result.confidenceLevel)}>
                          {getConfidenceIcon(result.confidenceLevel)}
                          <span className="ml-1 capitalize">{result.confidenceLevel}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {result.university.name} • {result.course.faculty}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>APS Gap: {result.requiredAPS - result.apsScore}</span>
                          <span>R{result.course.estimated_cost.toLocaleString()}</span>
                        </div>
                        {result.improvementSuggestions.slice(0, 1).map((suggestion, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            {suggestion}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedCourse.course.name}</CardTitle>
            <CardDescription>
              {selectedCourse.university.name} • {selectedCourse.course.faculty}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Qualification Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>APS Score:</span>
                    <span>{selectedCourse.apsScore}/{selectedCourse.requiredAPS}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={selectedCourse.eligible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {selectedCourse.eligible ? 'Eligible' : 'Needs Improvement'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <Badge className={getConfidenceColor(selectedCourse.confidenceLevel)}>
                      {getConfidenceIcon(selectedCourse.confidenceLevel)}
                      <span className="ml-1 capitalize">{selectedCourse.confidenceLevel}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Course Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span>R{selectedCourse.course.estimated_cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span>{selectedCourse.course.points_required}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span>{selectedCourse.priority.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedCourse.missingRequirements.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Missing Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedCourse.missingRequirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedCourse.improvementSuggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Improvement Suggestions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {selectedCourse.improvementSuggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Course Modules</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.course.modules.slice(0, 6).map((module, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {module}
                  </Badge>
                ))}
                {selectedCourse.course.modules.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedCourse.course.modules.length - 6} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                Close
              </Button>
              {!selectedCourse.eligible && (
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Get Improvement Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualificationDemo;
