import { CourseRepository } from './data/repositories/courses'
import { DepartmentRepository } from './data/repositories/departments'
import { FacultyRepository } from './data/repositories/faculties'
import { InstitutionRepository } from './data/repositories/institutions'
import { CoursesUseCase } from './domain/useCases/courses'
import { DepartmentsUseCase } from './domain/useCases/departments'
import { FacultiesUseCase } from './domain/useCases/faculties'
import { InstitutionsUseCase } from './domain/useCases/institutions'

const courseRepository = CourseRepository.getInstance()
const institutionRepository = InstitutionRepository.getInstance()
const facultyRepository = FacultyRepository.getInstance()
const departmentRepository = DepartmentRepository.getInstance()

export const InstitutionsUseCases = new InstitutionsUseCase(institutionRepository)
export const FacultiesUseCases = new FacultiesUseCase(facultyRepository)
export const DepartmentsUseCases = new DepartmentsUseCase(departmentRepository)
export const CoursesUseCases = new CoursesUseCase(courseRepository)