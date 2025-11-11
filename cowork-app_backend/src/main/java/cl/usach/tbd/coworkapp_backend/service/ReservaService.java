package cl.usach.tbd.coworkapp_backend.service;
import cl.usach.tbd.coworkapp_backend.dto.ReservaCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.ReservaResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.ReservaUpdateDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoReserva;
import cl.usach.tbd.coworkapp_backend.entity.Recurso;
import cl.usach.tbd.coworkapp_backend.entity.Reserva;
import cl.usach.tbd.coworkapp_backend.entity.Usuario;
import cl.usach.tbd.coworkapp_backend.repository.EstadoReservaRepository;
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
    @Autowired
    private EstadoReservaRepository estadoReservaRepository;

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

        EstadoReserva estadoReserva = estadoReservaRepository.findById(createDTO.getEstadoReservaId())
                .orElseThrow(() -> new RuntimeException("Estado de reserva no encontrado con id: " + createDTO.getEstadoReservaId()));

        if (createDTO.getTerminoReserva().isBefore(createDTO.getInicioReserva()) ||
            createDTO.getTerminoReserva().equals(createDTO.getInicioReserva())) {
            throw new RuntimeException("La hora de termino debe ser posterior a la hora de inicio");
        }

        Reserva reserva = new Reserva();
        reserva.setInicioReserva(createDTO.getInicioReserva());
        reserva.setTerminoReserva(createDTO.getTerminoReserva());
        reserva.setFechaCreacion(LocalDate.now());
        reserva.setValor(createDTO.getValor());
        reserva.setUsuario(usuario);
        reserva.setRecurso(recurso);
        reserva.setEstadoReserva(estadoReserva);

        Reserva savedReserva = reservaRepository.save(reserva);
        return convertToResponseDTO(savedReserva);
    }

    @Transactional
    public ReservaResponseDTO updateReserva(Long id, ReservaUpdateDTO updateDTO) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));

        if (updateDTO.getInicioReserva() != null) {
            reserva.setInicioReserva(updateDTO.getInicioReserva());
        }

        if (updateDTO.getTerminoReserva() != null) {
            reserva.setTerminoReserva(updateDTO.getTerminoReserva());
        }

        if (reserva.getTerminoReserva().isBefore(reserva.getInicioReserva()) ||
            reserva.getTerminoReserva().equals(reserva.getInicioReserva())) {
            throw new RuntimeException("La hora de termino debe ser posterior a la hora de inicio");
        }

        if (updateDTO.getValor() != null) {
            reserva.setValor(updateDTO.getValor());
        }

        if (updateDTO.getEstadoReservaId() != null) {
            EstadoReserva estadoReserva = estadoReservaRepository.findById(updateDTO.getEstadoReservaId())
                    .orElseThrow(() -> new RuntimeException("Estado de reserva no encontrado con id: " + updateDTO.getEstadoReservaId()));
            reserva.setEstadoReserva(estadoReserva);
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
    public ReservaResponseDTO deleteReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con id: " + id));

        // Borrado lógico: cambiar el estado a "Cancelada"
        EstadoReserva estadoCancelada = estadoReservaRepository.findByNombre("Cancelada")
                .orElseThrow(() -> new RuntimeException("Estado 'Cancelada' no encontrado en la base de datos"));

        reserva.setEstadoReserva(estadoCancelada);
        Reserva updatedReserva = reservaRepository.save(reserva);

        return convertToResponseDTO(updatedReserva);
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
    public List<ReservaResponseDTO> getReservasByEstadoReservaId(Long estadoReservaId) {
        return reservaRepository.findByEstadoReservaId(estadoReservaId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservaResponseDTO> getReservasByFechaCreacion(LocalDate fechaCreacion) {
        return reservaRepository.findByFechaCreacion(fechaCreacion).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private ReservaResponseDTO convertToResponseDTO(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setId(reserva.getId());
        dto.setInicioReserva(reserva.getInicioReserva());
        dto.setTerminoReserva(reserva.getTerminoReserva());
        dto.setFechaCreacion(reserva.getFechaCreacion());
        dto.setValor(reserva.getValor());
        dto.setUsuarioId(reserva.getUsuario().getId());
        dto.setUsuarioNombre(reserva.getUsuario().getNombre());
        dto.setRecursoId(reserva.getRecurso().getId());
        dto.setRecursoNombre(reserva.getRecurso().getNombre());
        dto.setEstadoReservaId(reserva.getEstadoReserva().getId());
        dto.setEstadoReservaNombre(reserva.getEstadoReserva().getNombre());
        return dto;
    }
}
