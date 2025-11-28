package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.PlanCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.PlanResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.PlanUpdateDTO;
import cl.usach.tbd.coworkapp_backend.entity.Plan;
import cl.usach.tbd.coworkapp_backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<PlanResponseDTO> getAllPlanes() {
        return planRepository.findAll().stream()
                .filter(this::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlanResponseDTO getPlanById(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + id));

        if (!isActive(plan)) {
            throw new RuntimeException("Plan no activo con id: " + id);
        }

        return convertToDTO(plan);
    }

    @Transactional
    public PlanResponseDTO createPlan(PlanCreateDTO createDTO) {
        // Validaciones
        if (createDTO.getNombre() == null || createDTO.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre del plan es obligatorio");
        }

        if (createDTO.getPrecioMensual() == null || createDTO.getPrecioMensual() < 0) {
            throw new RuntimeException("El precio mensual debe ser mayor o igual a 0");
        }

        if (createDTO.getTiempoIncluido() == null || createDTO.getTiempoIncluido() < 0) {
            throw new RuntimeException("El tiempo incluido debe ser mayor o igual a 0");
        }

        // Verificar que no exista un plan con el mismo nombre
        Optional<Plan> planExistente = planRepository.findByNombre(createDTO.getNombre().trim());
        if (planExistente.isPresent()) {
            throw new RuntimeException("Ya existe un plan con el nombre: " + createDTO.getNombre());
        }

        Plan plan = new Plan();
        plan.setNombre(createDTO.getNombre().trim());
        plan.setPrecioMensual(createDTO.getPrecioMensual());
        plan.setTiempoIncluido(createDTO.getTiempoIncluido());
        plan.setActivo(createDTO.getActivo() != null ? createDTO.getActivo() : true);

        Plan savedPlan = planRepository.save(plan);
        return convertToDTO(savedPlan);
    }

    @Transactional
    public PlanResponseDTO updatePlan(Long id, PlanUpdateDTO updateDTO) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + id));

        if (updateDTO.getNombre() != null && !updateDTO.getNombre().trim().isEmpty()) {
            // Verificar que no exista otro plan con el mismo nombre
            Optional<Plan> planExistente = planRepository.findByNombre(updateDTO.getNombre().trim());
            if (planExistente.isPresent() && !planExistente.get().getId().equals(id)) {
                throw new RuntimeException("Ya existe otro plan con el nombre: " + updateDTO.getNombre());
            }
            plan.setNombre(updateDTO.getNombre().trim());
        }

        if (updateDTO.getPrecioMensual() != null) {
            if (updateDTO.getPrecioMensual() < 0) {
                throw new RuntimeException("El precio mensual debe ser mayor o igual a 0");
            }
            plan.setPrecioMensual(updateDTO.getPrecioMensual());
        }

        if (updateDTO.getTiempoIncluido() != null) {
            if (updateDTO.getTiempoIncluido() < 0) {
                throw new RuntimeException("El tiempo incluido debe ser mayor o igual a 0");
            }
            plan.setTiempoIncluido(updateDTO.getTiempoIncluido());
        }

        if (updateDTO.getActivo() != null) {
            plan.setActivo(updateDTO.getActivo());
        }

        Plan updatedPlan = planRepository.save(plan);
        return convertToDTO(updatedPlan);
    }

    @Transactional
    public PlanResponseDTO deletePlan(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado con id: " + id));

        // Borrado lógico: cambiar el estado a inactivo
        plan.setActivo(false);
        Plan updatedPlan = planRepository.save(plan);

        return convertToDTO(updatedPlan);
    }

    @Transactional(readOnly = true)
    public List<PlanResponseDTO> getPlanByNombre(String nombre) {
        return planRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .filter(this::isNotDeleted)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private boolean isNotDeleted(Plan plan) {
        return plan.getActivo() != false;
    }

    /**
     * Válida que el plan esté activo
     */
    private boolean isActive(Plan plan) {
        return plan.getActivo();
    }

    private PlanResponseDTO convertToDTO(Plan plan) {
        PlanResponseDTO dto = new PlanResponseDTO();
        dto.setId(plan.getId());
        dto.setNombre(plan.getNombre());
        dto.setPrecioMensual(plan.getPrecioMensual());
        dto.setTiempoIncluido(plan.getTiempoIncluido());
        dto.setActivo(plan.getActivo());
        return dto;
    }
}

