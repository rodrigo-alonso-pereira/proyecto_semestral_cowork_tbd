package cl.usach.tbd.coworkapp_backend.service;
import cl.usach.tbd.coworkapp_backend.dto.ReservaCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.ReservaResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.ReservaUpdateDTO;
import cl.usach.tbd.coworkapp_backend.entity.Recurso;
import cl.usach.tbd.coworkapp_backend.entity.Reserva;
import cl.usach.tbd.coworkapp_backend.entity.Usuario;
import cl.usach.tbd.coworkapp_backend.repository.RecursoRepository;
import cl.usach.tbd.coworkapp_backend.repository.ReservaRepository;
import cl.usach.tbd.coworkapp_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class ReservaService {
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RecursoRepository recursoRepository;
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> getAllReservas() {
        return reservaRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public ReservaResponseDTO getReservaById(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));
        return convertToResponseDTO(reserva);
    }
    @Transactional
    public ReservaResponseDTO createReserva(ReservaCreateDTO createDTO) {
        Usuario usuario = usuarioRepository.findById(createDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + createDTO.getUsuarioId()));
        Recurso recurso = recursoRepository.findById(createDTO.getRecursoId())
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con id: " + createDTO.getRecursoId()));
        if (createDTO.getHoraTermino().isBefore(createDTO.getHoraInicio()) || 
            createDTO.getHoraTermino().equals(createDTO.getHoraInicio())) {
            throw new RuntimeException("La hora de termino debe ser posterior a la hora de inicio");
        }
        Reserva reserva = new Reserva();
        reserva.setHoraInicio(createDTO.getHoraInicio());
        reserva.setHoraTermino(createDTO.getHoraTermino());
        reserva.setEstado(true);
        reserva.setFechaReserva(createDTO.getFechaReserva() != null ? createDTO.getFechaReserva() : LocalDate.now());
        reserva.setValorReserva(createDTO.getValorReserva());
        reserva.setUsuario(usuario);
        reserva.setRecurso(recurso);
        Reserva savedReserva = reservaRepository.save(reserva);
        return convertToResponseDTO(savedReserva);
    }
    @Transactional
    public ReservaResponseDTO updateReserva(Long id, ReservaUpdateDTO updateDTO) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));
        if (updateDTO.getHoraInicio() != null) {
            reserva.setHoraInicio(updateDTO.getHoraInicio());
        }
        if (updateDTO.getHoraTermino() != null) {
            reserva.setHoraTermino(updateDTO.getHoraTermino());
        }
        if (reserva.getHoraTermino().isBefore(reserva.getHoraInicio()) || 
            reserva.getHoraTermino().equals(reserva.getHoraInicio())) {
            throw new RuntimeException("La hora de termino debe ser posterior a la hora de inicio");
        }
        if (updateDTO.getEstado() != null) {
            reserva.setEstado(updateDTO.getEstado());
        }
        if (updateDTO.getFechaReserva() != null) {
            reserva.setFechaReserva(updateDTO.getFechaReserva());
        }
        if (updateDTO.getValorReserva() != null) {
            reserva.setValorReserva(updateDTO.getValorReserva());
        }
        if (updateDTO.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(updateDTO.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + updateDTO.getUsuarioId()));
            reserva.setUsuario(usuario);
        }
        if (updateDTO.getRecursoId() != null) {
            Recurso recurso = recursoRepository.findById(updateDTO.getRecursoId())
                    .orElseThrow(() -> new RuntimeException("Recurso no encontrado con id: " + updateDTO.getRecursoId()));
            reserva.setRecurso(recurso);
        }
        Reserva updatedReserva = reservaRepository.save(reserva);
        return convertToResponseDTO(updatedReserva);
    }
    @Transactional
    public void deleteReserva(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new RuntimeException("Reserva no encontrada con id: " + id);
        }
        reservaRepository.deleteById(id);
    }
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> getReservasByUsuarioId(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> getReservasByRecursoId(Long recursoId) {
        return reservaRepository.findByRecursoId(recursoId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> getReservasByEstado(Boolean estado) {
        return reservaRepository.findByEstado(estado).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> getReservasByFecha(LocalDate fecha) {
        return reservaRepository.findByFechaReserva(fecha).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }
    private ReservaResponseDTO convertToResponseDTO(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setId(reserva.getId());
        dto.setHoraInicio(reserva.getHoraInicio());
        dto.setHoraTermino(reserva.getHoraTermino());
        dto.setEstado(reserva.getEstado());
        dto.setFechaReserva(reserva.getFechaReserva());
        dto.setValorReserva(reserva.getValorReserva());
        dto.setUsuarioId(reserva.getUsuario().getId());
        dto.setUsuarioNombre(reserva.getUsuario().getNombre());
        dto.setRecursoId(reserva.getRecurso().getId());
        dto.setRecursoNombre(reserva.getRecurso().getNombre());
        return dto;
    }
}
