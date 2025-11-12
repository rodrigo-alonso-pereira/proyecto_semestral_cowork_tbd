package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.PlanResponseDTO;
import cl.usach.tbd.coworkapp_backend.entity.Plan;
import cl.usach.tbd.coworkapp_backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

